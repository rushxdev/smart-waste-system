import { WasteTrackingService } from "../../src/services/wasteTracking.service.js";
import { WasteTrackingRepository } from "../../src/repositories/wasteTracking.repository.js";
import type { ITracking } from "../../src/models/wasteTracking.model.js";
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Test Data Factory (Single Responsibility - creates test data)
class WasteTrackingTestDataFactory {
  static createValidTrackingData(overrides: Partial<ITracking> = {}): Partial<ITracking> {
    return {
      requestId: "REQ123",
      status: "Scheduled",
      updatedBy: "COLLECTOR001",
      updatedAt: new Date("2025-10-15T10:00:00Z"),
      ...overrides
    };
  }

  static createMockTracking(overrides: Partial<ITracking> = {}): ITracking {
    return {
      _id: "trackingId123",
      requestId: "REQ123",
      status: "Scheduled",
      updatedBy: "COLLECTOR001",
      updatedAt: new Date("2025-10-15T10:00:00Z"),
      ...overrides,
      // Mock Mongoose Document methods
      save: jest.fn(),
      toObject: jest.fn(),
      toJSON: jest.fn(),
    } as unknown as ITracking;
  }

  static createMultipleTrackingRecords(count: number): ITracking[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockTracking({
        _id: `trackingId${index + 1}`,
        requestId: `REQ${index + 1}`,
        updatedBy: `COLLECTOR${String(index + 1).padStart(3, '0')}`,
      })
    );
  }

  static getValidStatuses(): string[] {
    return ["Scheduled", "In Progress", "Collected"];
  }

  static getInvalidStatuses(): string[] {
    return ["Pending", "Cancelled", "Invalid", "", " "];
  }
}

// Mock Repository Factory (Dependency Inversion - abstracts mock creation)
class MockTrackingRepositoryFactory {
  static createMockRepository(): jest.Mocked<WasteTrackingRepository> {
    return {
      findByRequestId: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<WasteTrackingRepository>;
  }
}

// Test Suite
describe("WasteTrackingService", () => {
  let service: WasteTrackingService;
  let mockRepo: jest.Mocked<WasteTrackingRepository>;

  // Setup and Teardown (Interface Segregation - clean test isolation)
  beforeEach(() => {
    mockRepo = MockTrackingRepositoryFactory.createMockRepository();
    service = new WasteTrackingService(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getStatusByRequestId", () => {
    describe("Success Cases", () => {
      it("should return tracking record when found", async () => {
        const requestId = "REQ123";
        const mockTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId,
          status: "In Progress"
        });
        
        mockRepo.findByRequestId.mockResolvedValue(mockTracking);

        const result = await service.getStatusByRequestId(requestId);

        expect(mockRepo.findByRequestId).toHaveBeenCalledWith(requestId);
        expect(mockRepo.findByRequestId).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockTracking);
        expect(result).not.toBeNull();
        expect(result!.requestId).toBe(requestId);
        expect(result!.status).toBe("In Progress");
      });

      it("should handle different valid statuses", async () => {
        const requestId = "REQ123";
        const validStatuses = WasteTrackingTestDataFactory.getValidStatuses();

        for (const status of validStatuses) {
          const mockTracking = WasteTrackingTestDataFactory.createMockTracking({
            requestId,
            status: status as any
          });
          
          mockRepo.findByRequestId.mockResolvedValue(mockTracking);

          const result = await service.getStatusByRequestId(requestId);

          expect(result).not.toBeNull();
          expect(result!.status).toBe(status);
          mockRepo.findByRequestId.mockClear();
        }
      });

      it("should return tracking record with collector information", async () => {
        const requestId = "REQ123";
        const collectorId = "COLLECTOR001";
        const mockTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId,
          updatedBy: collectorId
        });
        
        mockRepo.findByRequestId.mockResolvedValue(mockTracking);

        const result = await service.getStatusByRequestId(requestId);

        expect(result).not.toBeNull();
        expect(result!.updatedBy).toBe(collectorId);
        expect(result!.updatedAt).toBeDefined();
      });
    });

    describe("Error Cases", () => {
      it("should throw error when no tracking record is found", async () => {
        const requestId = "NONEXISTENT";
        
        mockRepo.findByRequestId.mockResolvedValue(null);

        await expect(service.getStatusByRequestId(requestId))
          .rejects.toThrow("No tracking record found for this request");
        
        expect(mockRepo.findByRequestId).toHaveBeenCalledWith(requestId);
        expect(mockRepo.findByRequestId).toHaveBeenCalledTimes(1);
      });

      it("should propagate repository errors", async () => {
        const requestId = "REQ123";
        const repositoryError = new Error("Database connection failed");
        
        mockRepo.findByRequestId.mockRejectedValue(repositoryError);

        await expect(service.getStatusByRequestId(requestId))
          .rejects.toThrow("Database connection failed");
        
        expect(mockRepo.findByRequestId).toHaveBeenCalledWith(requestId);
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty string requestId", async () => {
        const requestId = "";
        
        mockRepo.findByRequestId.mockResolvedValue(null);

        await expect(service.getStatusByRequestId(requestId))
          .rejects.toThrow("No tracking record found for this request");
        
        expect(mockRepo.findByRequestId).toHaveBeenCalledWith(requestId);
      });

      it("should handle special characters in requestId", async () => {
        const requestId = "REQ-123_special@chars";
        const mockTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId
        });
        
        mockRepo.findByRequestId.mockResolvedValue(mockTracking);

        const result = await service.getStatusByRequestId(requestId);

        expect(result).not.toBeNull();
        expect(result!.requestId).toBe(requestId);
      });
    });
  });

  describe("updateTrackingStatus", () => {
    describe("Validation Tests", () => {
      it("should throw error for invalid status", async () => {
        const requestId = "REQ123";
        const collectorId = "COLLECTOR001";
        const invalidStatuses = WasteTrackingTestDataFactory.getInvalidStatuses();

        for (const invalidStatus of invalidStatuses) {
          await expect(service.updateTrackingStatus(requestId, invalidStatus, collectorId))
            .rejects.toThrow("Invalid status");
          
          expect(mockRepo.updateStatus).not.toHaveBeenCalled();
          mockRepo.updateStatus.mockClear();
        }
      });

      it("should accept all valid statuses", async () => {
        const requestId = "REQ123";
        const collectorId = "COLLECTOR001";
        const validStatuses = WasteTrackingTestDataFactory.getValidStatuses();

        for (const status of validStatuses) {
          const mockUpdatedTracking = WasteTrackingTestDataFactory.createMockTracking({
            requestId,
            status: status as any,
            updatedBy: collectorId
          });
          
          mockRepo.updateStatus.mockResolvedValue(mockUpdatedTracking);

          const result = await service.updateTrackingStatus(requestId, status, collectorId);

          expect(mockRepo.updateStatus).toHaveBeenCalledWith(requestId, status, collectorId);
          expect(result.status).toBe(status);
          mockRepo.updateStatus.mockClear();
        }
      });

      it("should be case-sensitive for status validation", async () => {
        const requestId = "REQ123";
        const collectorId = "COLLECTOR001";
        const caseSensitiveStatuses = ["scheduled", "SCHEDULED", "in progress", "IN PROGRESS"];

        for (const status of caseSensitiveStatuses) {
          await expect(service.updateTrackingStatus(requestId, status, collectorId))
            .rejects.toThrow("Invalid status");
          
          expect(mockRepo.updateStatus).not.toHaveBeenCalled();
        }
      });
    });

    describe("Success Cases", () => {
      it("should successfully update tracking status with valid data", async () => {
        const requestId = "REQ123";
        const status = "In Progress";
        const collectorId = "COLLECTOR001";
        const mockUpdatedTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId,
          status: status as any,
          updatedBy: collectorId,
          updatedAt: new Date()
        });
        
        mockRepo.updateStatus.mockResolvedValue(mockUpdatedTracking);

        const result = await service.updateTrackingStatus(requestId, status, collectorId);

        expect(mockRepo.updateStatus).toHaveBeenCalledWith(requestId, status, collectorId);
        expect(mockRepo.updateStatus).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockUpdatedTracking);
        expect(result.requestId).toBe(requestId);
        expect(result.status).toBe(status);
        expect(result.updatedBy).toBe(collectorId);
      });

      it("should handle status progression workflow", async () => {
        const requestId = "REQ123";
        const collectorId = "COLLECTOR001";
        const statusProgression = ["Scheduled", "In Progress", "Collected"];

        for (let i = 0; i < statusProgression.length; i++) {
          const status = statusProgression[i];
          const mockUpdatedTracking = WasteTrackingTestDataFactory.createMockTracking({
            requestId,
            status: status as any,
            updatedBy: collectorId,
            updatedAt: new Date(Date.now() + i * 1000) // Different timestamps
          });
          
          mockRepo.updateStatus.mockResolvedValue(mockUpdatedTracking);

          const result = await service.updateTrackingStatus(requestId, status, collectorId);

          expect(result.status).toBe(status);
          expect(result.updatedBy).toBe(collectorId);
          mockRepo.updateStatus.mockClear();
        }
      });

      it("should handle different collector IDs", async () => {
        const requestId = "REQ123";
        const status = "In Progress";
        const collectorIds = ["COLLECTOR001", "COLLECTOR002", "TEMP_COLLECTOR_999"];

        for (const collectorId of collectorIds) {
          const mockUpdatedTracking = WasteTrackingTestDataFactory.createMockTracking({
            requestId,
            status: status as any,
            updatedBy: collectorId
          });
          
          mockRepo.updateStatus.mockResolvedValue(mockUpdatedTracking);

          const result = await service.updateTrackingStatus(requestId, status, collectorId);

          expect(result.updatedBy).toBe(collectorId);
          mockRepo.updateStatus.mockClear();
        }
      });
    });

    describe("Error Handling", () => {
      it("should propagate repository errors during update", async () => {
        const requestId = "REQ123";
        const status = "Collected";
        const collectorId = "COLLECTOR001";
        const repositoryError = new Error("Database update failed");
        
        mockRepo.updateStatus.mockRejectedValue(repositoryError);

        await expect(service.updateTrackingStatus(requestId, status, collectorId))
          .rejects.toThrow("Database update failed");
        
        expect(mockRepo.updateStatus).toHaveBeenCalledWith(requestId, status, collectorId);
      });

      it("should validate status before calling repository", async () => {
        const requestId = "REQ123";
        const invalidStatus = "InvalidStatus";
        const collectorId = "COLLECTOR001";

        await expect(service.updateTrackingStatus(requestId, invalidStatus, collectorId))
          .rejects.toThrow("Invalid status");
        
        // Repository should not be called for invalid status
        expect(mockRepo.updateStatus).not.toHaveBeenCalled();
      });
    });

    describe("Edge Cases", () => {
      it("should handle empty strings for requestId and collectorId", async () => {
        const requestId = "";
        const status = "Scheduled";
        const collectorId = "";
        const mockUpdatedTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId,
          status: status as any,
          updatedBy: collectorId
        });
        
        mockRepo.updateStatus.mockResolvedValue(mockUpdatedTracking);

        const result = await service.updateTrackingStatus(requestId, status, collectorId);

        expect(mockRepo.updateStatus).toHaveBeenCalledWith(requestId, status, collectorId);
        expect(result.requestId).toBe(requestId);
        expect(result.updatedBy).toBe(collectorId);
      });

      it("should handle special characters in parameters", async () => {
        const requestId = "REQ-123_@special";
        const status = "Collected";
        const collectorId = "COLLECTOR@001_special";
        const mockUpdatedTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId,
          status: status as any,
          updatedBy: collectorId
        });
        
        mockRepo.updateStatus.mockResolvedValue(mockUpdatedTracking);

        const result = await service.updateTrackingStatus(requestId, status, collectorId);

        expect(result.requestId).toBe(requestId);
        expect(result.updatedBy).toBe(collectorId);
      });
    });
  });

  describe("Integration Tests", () => {
    it("should maintain consistent behavior across service methods", async () => {
      const requestId = "REQ123";
      const collectorId = "COLLECTOR001";
      
      // First, try to get status (should fail initially)
      mockRepo.findByRequestId.mockResolvedValue(null);
      
      await expect(service.getStatusByRequestId(requestId))
        .rejects.toThrow("No tracking record found for this request");

      // Update status (should succeed)
      const updatedTracking = WasteTrackingTestDataFactory.createMockTracking({
        requestId,
        status: "In Progress",
        updatedBy: collectorId
      });
      
      mockRepo.updateStatus.mockResolvedValue(updatedTracking);
      
      const updateResult = await service.updateTrackingStatus(requestId, "In Progress", collectorId);
      expect(updateResult.status).toBe("In Progress");

      // Now get status should succeed
      mockRepo.findByRequestId.mockResolvedValue(updatedTracking);
      
      const getResult = await service.getStatusByRequestId(requestId);
      expect(getResult).not.toBeNull();
      expect(getResult!.status).toBe("In Progress");
      expect(getResult!.updatedBy).toBe(collectorId);

      // Verify all methods were called correctly
      expect(mockRepo.findByRequestId).toHaveBeenCalledTimes(2);
      expect(mockRepo.updateStatus).toHaveBeenCalledTimes(1);
    });

    it("should handle complete workflow from scheduling to collection", async () => {
      const requestId = "REQ123";
      const collectorId = "COLLECTOR001";
      const workflow = ["Scheduled", "In Progress", "Collected"];

      for (let i = 0; i < workflow.length; i++) {
        const status = workflow[i];
        const mockTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId,
          status: status as any,
          updatedBy: collectorId,
          updatedAt: new Date(Date.now() + i * 60000) // 1 minute intervals
        });
        
        // Update status
        mockRepo.updateStatus.mockResolvedValue(mockTracking);
        const updateResult = await service.updateTrackingStatus(requestId, status, collectorId);
        expect(updateResult.status).toBe(status);
        
        // Get status to verify
        mockRepo.findByRequestId.mockResolvedValue(mockTracking);
        const getResult = await service.getStatusByRequestId(requestId);
        expect(getResult).not.toBeNull();
        expect(getResult!.status).toBe(status);
        
        // Clear mocks for next iteration
        mockRepo.updateStatus.mockClear();
        mockRepo.findByRequestId.mockClear();
      }
    });
  });

  describe("Business Logic Tests", () => {
    it("should enforce allowed status transitions", async () => {
      const allowedStatuses = WasteTrackingTestDataFactory.getValidStatuses();
      const requestId = "REQ123";
      const collectorId = "COLLECTOR001";

      // Test that all allowed statuses work
      for (const status of allowedStatuses) {
        const mockTracking = WasteTrackingTestDataFactory.createMockTracking({
          requestId,
          status: status as any,
          updatedBy: collectorId
        });
        
        mockRepo.updateStatus.mockResolvedValue(mockTracking);

        const result = await service.updateTrackingStatus(requestId, status, collectorId);
        expect(allowedStatuses).toContain(result.status);
        
        mockRepo.updateStatus.mockClear();
      }
    });

    it("should maintain data consistency across operations", async () => {
      const requestId = "REQ123";
      const originalCollectorId = "COLLECTOR001";
      const newCollectorId = "COLLECTOR002";
      
      // Initial tracking
      const initialTracking = WasteTrackingTestDataFactory.createMockTracking({
        requestId,
        status: "Scheduled",
        updatedBy: originalCollectorId
      });
      
      mockRepo.findByRequestId.mockResolvedValue(initialTracking);
      const initial = await service.getStatusByRequestId(requestId);
      expect(initial).not.toBeNull();
      expect(initial!.updatedBy).toBe(originalCollectorId);
      
      // Update with new collector
      const updatedTracking = WasteTrackingTestDataFactory.createMockTracking({
        requestId,
        status: "In Progress",
        updatedBy: newCollectorId
      });
      
      mockRepo.updateStatus.mockResolvedValue(updatedTracking);
      const updated = await service.updateTrackingStatus(requestId, "In Progress", newCollectorId);
      expect(updated.updatedBy).toBe(newCollectorId);
      expect(updated.requestId).toBe(requestId);
    });
  });
});
