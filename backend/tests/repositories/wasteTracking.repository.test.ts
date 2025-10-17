import { WasteTrackingRepository } from "../../src/repositories/wasteTracking.repository";
import Tracking, { type ITracking } from "../../src/models/wasteTracking.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the Tracking model
jest.mock("../../src/models/wasteTracking.model");

describe("WasteTrackingRepository", () => {
  let wasteTrackingRepository: WasteTrackingRepository;

  beforeEach(() => {
    wasteTrackingRepository = new WasteTrackingRepository();
    jest.clearAllMocks();
  });

  describe("findByRequestId", () => {
    it("should find tracking by request ID", async () => {
      const mockTracking = {
        _id: "tracking123",
        requestId: "request123",
        status: "In Transit"
      } as ITracking;

      (Tracking.findOne as jest.Mock).mockResolvedValue(mockTracking);

      const result = await wasteTrackingRepository.findByRequestId("request123");

      expect(Tracking.findOne).toHaveBeenCalledWith({ requestId: "request123" });
      expect(result).toEqual(mockTracking);
    });

    it("should return null when tracking not found", async () => {
      (Tracking.findOne as jest.Mock).mockResolvedValue(null);

      const result = await wasteTrackingRepository.findByRequestId("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("updateStatus", () => {
    it("should update existing tracking status", async () => {
      const existingTracking = {
        _id: "tracking123",
        requestId: "request123",
        status: "Pending",
        updatedBy: "old-user",
        updatedAt: new Date("2025-10-15"),
        save: jest.fn().mockResolvedValue({
          _id: "tracking123",
          requestId: "request123",
          status: "In Transit",
          updatedBy: "collector123",
          updatedAt: expect.any(Date)
        })
      } as unknown as ITracking;

      (Tracking.findOne as jest.Mock).mockResolvedValue(existingTracking);

      const result = await wasteTrackingRepository.updateStatus("request123", "In Transit", "collector123");

      expect(Tracking.findOne).toHaveBeenCalledWith({ requestId: "request123" });
      expect(existingTracking.status).toBe("In Transit");
      expect(existingTracking.updatedBy).toBe("collector123");
      expect(existingTracking.save).toHaveBeenCalled();
    });

    it("should create new tracking when not found", async () => {
      (Tracking.findOne as jest.Mock).mockResolvedValue(null);

      const mockNewTracking = {
        _id: "tracking123",
        requestId: "request123",
        status: "Collected",
        updatedBy: "collector123",
        save: jest.fn()
      } as unknown as ITracking;

      const mockSave = jest.fn().mockResolvedValue(mockNewTracking);
      (Tracking as unknown as jest.Mock).mockImplementation(() => ({
        ...mockNewTracking,
        save: mockSave
      }));

      const result = await wasteTrackingRepository.updateStatus("request123", "Collected", "collector123");

      expect(Tracking.findOne).toHaveBeenCalledWith({ requestId: "request123" });
      expect(Tracking).toHaveBeenCalledWith({
        requestId: "request123",
        status: "Collected",
        updatedBy: "collector123"
      });
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
