import { WasteRequestRepository } from "../../src/repositories/wasteRequest.repository";
import WasteRequest, { type IWasteRequest } from "../../src/models/wasteRequest.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the WasteRequest model
jest.mock("../../src/models/wasteRequest.model");

describe("WasteRequestRepository", () => {
  let wasteRequestRepository: WasteRequestRepository;

  beforeEach(() => {
    wasteRequestRepository = new WasteRequestRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create and save a new waste request", async () => {
      const requestData = {
        residentId: "resident123",
        address: "123 Main St",
        wasteType: "Plastic",
        preferredDate: "2025-10-20",
        preferredTime: "09:00 AM"
      };

      const mockSavedRequest = {
        _id: "request123",
        ...requestData,
        status: "Scheduled",
        save: jest.fn()
      } as unknown as IWasteRequest;

      const mockSave = jest.fn().mockResolvedValue(mockSavedRequest);
      (WasteRequest as unknown as jest.Mock).mockImplementation(() => ({
        ...mockSavedRequest,
        save: mockSave
      }));

      const result = await wasteRequestRepository.create(requestData);

      expect(WasteRequest).toHaveBeenCalledWith(requestData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockSavedRequest);
    });
  });

  describe("findByResident", () => {
    it("should find waste requests by resident ID", async () => {
      const mockRequests = [
        { _id: "request1", residentId: "resident123", wasteType: "Plastic" },
        { _id: "request2", residentId: "resident123", wasteType: "Organic" }
      ] as IWasteRequest[];

      (WasteRequest.find as jest.Mock).mockResolvedValue(mockRequests);

      const result = await wasteRequestRepository.findByResident("resident123");

      expect(WasteRequest.find).toHaveBeenCalledWith({ residentId: "resident123" });
      expect(result).toEqual(mockRequests);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no requests found", async () => {
      (WasteRequest.find as jest.Mock).mockResolvedValue([]);

      const result = await wasteRequestRepository.findByResident("resident999");

      expect(result).toEqual([]);
    });
  });

  describe("findAll", () => {
    it("should return all waste requests", async () => {
      const mockRequests = [
        { _id: "request1", wasteType: "Plastic" },
        { _id: "request2", wasteType: "Organic" },
        { _id: "request3", wasteType: "Paper" }
      ] as IWasteRequest[];

      (WasteRequest.find as jest.Mock).mockResolvedValue(mockRequests);

      const result = await wasteRequestRepository.findAll();

      expect(WasteRequest.find).toHaveBeenCalled();
      expect(result).toEqual(mockRequests);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when no requests exist", async () => {
      (WasteRequest.find as jest.Mock).mockResolvedValue([]);

      const result = await wasteRequestRepository.findAll();

      expect(result).toEqual([]);
    });
  });
});
