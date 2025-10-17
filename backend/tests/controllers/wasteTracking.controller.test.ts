import { WasteTrackingController } from "../../src/controllers/wasteTracking.controller";
import { WasteTrackingService } from "../../src/services/wasteTracking.service";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the WasteTrackingService
jest.mock("../../src/services/wasteTracking.service");
jest.mock("../../src/repositories/wasteTracking.repository");

describe("WasteTrackingController", () => {
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

  describe("getStatus", () => {
    it("should get tracking status and return 200", async () => {
      const mockTracking = {
        _id: "tracking123",
        requestId: "request123",
        status: "In Transit",
        updatedBy: "collector123"
      };

      mockRequest.params = { requestId: "request123" };
      (WasteTrackingService.prototype.getStatusByRequestId as jest.Mock).mockResolvedValue(mockTracking);

      await WasteTrackingController.getStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTracking);
    });

    it("should return 400 when requestId is missing", async () => {
      mockRequest.params = {};

      await WasteTrackingController.getStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "Missing requestId parameter" });
    });

    it("should return 404 when tracking not found", async () => {
      mockRequest.params = { requestId: "nonexistent" };
      (WasteTrackingService.prototype.getStatusByRequestId as jest.Mock).mockRejectedValue(new Error("Tracking not found"));

      await WasteTrackingController.getStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: "Tracking not found" });
    });
  });

  describe("updateStatus", () => {
    it("should update tracking status and return 200", async () => {
      const mockTracking = {
        _id: "tracking123",
        requestId: "request123",
        status: "Collected",
        updatedBy: "collector123"
      };

      mockRequest.params = { requestId: "request123" };
      mockRequest.body = { status: "Collected", collectorId: "collector123" };
      (WasteTrackingService.prototype.updateTrackingStatus as jest.Mock).mockResolvedValue(mockTracking);

      await WasteTrackingController.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTracking);
    });

    it("should return 400 when requestId is missing", async () => {
      mockRequest.params = {};
      mockRequest.body = { status: "Collected", collectorId: "collector123" };

      await WasteTrackingController.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "Missing requestId parameter" });
    });

    it("should return 400 on service error", async () => {
      mockRequest.params = { requestId: "request123" };
      mockRequest.body = { status: "Invalid", collectorId: "collector123" };
      (WasteTrackingService.prototype.updateTrackingStatus as jest.Mock).mockRejectedValue(new Error("Invalid status"));

      await WasteTrackingController.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "Invalid status" });
    });
  });
});
