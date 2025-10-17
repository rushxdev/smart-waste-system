import { WasteRequestController } from "../../src/controllers/wasteRequest.controller";
import { WasteRequestService } from "../../src/services/wasteRequest.service";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the WasteRequestService
jest.mock("../../src/services/wasteRequest.service");
jest.mock("../../src/repositories/wasteRequest.repository");

describe("WasteRequestController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      body: {},
      params: {}
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create waste request and return 201", async () => {
      const requestData = {
        residentId: "resident123",
        address: "123 Main St",
        wasteType: "Plastic",
        preferredDate: "2025-10-20",
        preferredTime: "09:00 AM"
      };

      const mockWasteRequest = {
        _id: "request123",
        ...requestData,
        status: "Scheduled"
      };

      mockRequest.body = requestData;
      (WasteRequestService.prototype.createPickupRequest as jest.Mock).mockResolvedValue(mockWasteRequest);

      await WasteRequestController.create(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockWasteRequest);
    });

    it("should return 400 on validation error", async () => {
      mockRequest.body = { wasteType: "Plastic" };
      (WasteRequestService.prototype.createPickupRequest as jest.Mock).mockRejectedValue(new Error("Missing required fields"));

      await WasteRequestController.create(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "Missing required fields" });
    });
  });

  describe("getByResident", () => {
    it("should get waste requests by resident and return 200", async () => {
      const mockRequests = [
        { _id: "request1", residentId: "resident123", wasteType: "Plastic" },
        { _id: "request2", residentId: "resident123", wasteType: "Organic" }
      ];

      mockRequest.params = { id: "resident123" };
      (WasteRequestService.prototype.getRequestsByResident as jest.Mock).mockResolvedValue(mockRequests);

      await WasteRequestController.getByResident(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockRequests);
    });

    it("should return 400 when resident ID is missing", async () => {
      mockRequest.params = {};

      await WasteRequestController.getByResident(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "Resident ID is required." });
    });

    it("should return 500 on service error", async () => {
      mockRequest.params = { id: "resident123" };
      (WasteRequestService.prototype.getRequestsByResident as jest.Mock).mockRejectedValue(new Error("Database error"));

      await WasteRequestController.getByResident(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getAll", () => {
    it("should get all waste requests and return 200", async () => {
      const mockRequests = [
        { _id: "request1", wasteType: "Plastic" },
        { _id: "request2", wasteType: "Organic" }
      ];

      (WasteRequestService.prototype.getAllRequests as jest.Mock).mockResolvedValue(mockRequests);

      await WasteRequestController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockRequests);
    });

    it("should return 500 on service error", async () => {
      (WasteRequestService.prototype.getAllRequests as jest.Mock).mockRejectedValue(new Error("Database error"));

      await WasteRequestController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
