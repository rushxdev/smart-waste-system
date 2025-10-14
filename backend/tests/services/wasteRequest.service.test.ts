import { WasteRequestService } from "../../src/services/wasteRequest.service";
import { WasteRequestRepository } from "../../src/repositories/wasteRequest.repository";
import type { IWasteRequest } from "../../src/models/wasteRequest.model";
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Test Data Factory (Single Responsibility - creates test data)
class WasteRequestTestDataFactory {
  static createValidInputData(overrides: Partial<IWasteRequest> = {}): Partial<IWasteRequest> {
    return {
      residentId: "R123",
      address: "123 Main St, Colombo 7",
      wasteType: "Plastic",
      preferredDate: "2025-10-15",
      preferredTime: "09:00 AM",
      ...overrides
    };
  }

  static createMockWasteRequest(overrides: Partial<IWasteRequest> = {}): IWasteRequest {
    return {
      _id: "mockId123",
      residentId: "R123",
      address: "123 Main St, Colombo 7",
      wasteType: "Plastic",
      preferredDate: "2025-10-15",
      preferredTime: "09:00 AM",
      status: "Scheduled",
      createdAt: new Date("2025-10-13T10:00:00Z"),
      notes: "",
      ...overrides,
      // Mock Mongoose Document methods
      save: jest.fn(),
      toObject: jest.fn(),
      toJSON: jest.fn(),
    } as unknown as IWasteRequest;
  }

  static createMultipleRequests(count: number): IWasteRequest[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockWasteRequest({
        _id: `mockId${index + 1}`,
        residentId: `R${index + 1}`,
        address: `${index + 1} Test St, Colombo ${index + 1}`,
      })
    );
  }
}

// Mock Repository Factory (Dependency Inversion - abstracts mock creation)
class MockRepositoryFactory {
  static createMockRepository(): jest.Mocked<WasteRequestRepository> {
    return {
      create: jest.fn(),
      findByResident: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<WasteRequestRepository>;
  }
}

// Test Suite
describe("WasteRequestService", () => {
  let service: WasteRequestService;
  let mockRepo: jest.Mocked<WasteRequestRepository>;

  // Setup and Teardown (Interface Segregation - clean test isolation)
  beforeEach(() => {
    mockRepo = MockRepositoryFactory.createMockRepository();
    service = new WasteRequestService(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPickupRequest", () => {
    describe("Validation Tests", () => {
      it("should throw error when residentId is missing", async () => {
        const invalidData = WasteRequestTestDataFactory.createValidInputData({
          residentId: undefined as any
        });

        await expect(service.createPickupRequest(invalidData))
          .rejects.toThrow("Missing required fields");
        
        expect(mockRepo.create).not.toHaveBeenCalled();
      });

      it("should throw error when address is missing", async () => {
        const invalidData = WasteRequestTestDataFactory.createValidInputData({
          address: undefined as any
        });

        await expect(service.createPickupRequest(invalidData))
          .rejects.toThrow("Missing required fields");
        
        expect(mockRepo.create).not.toHaveBeenCalled();
      });

      it("should throw error when wasteType is missing", async () => {
        const invalidData = WasteRequestTestDataFactory.createValidInputData({
          wasteType: undefined as any
        });

        await expect(service.createPickupRequest(invalidData))
          .rejects.toThrow("Missing required fields");
        
        expect(mockRepo.create).not.toHaveBeenCalled();
      });

      it("should throw error when multiple required fields are missing", async () => {
        const invalidData = {};

        await expect(service.createPickupRequest(invalidData))
          .rejects.toThrow("Missing required fields");
        
        expect(mockRepo.create).not.toHaveBeenCalled();
      });
    });

    describe("Success Cases", () => {
      it("should create a waste request with valid data", async () => {
        const inputData = WasteRequestTestDataFactory.createValidInputData();
        const expectedResult = WasteRequestTestDataFactory.createMockWasteRequest();
        
        mockRepo.create.mockResolvedValue(expectedResult);

        const result = await service.createPickupRequest(inputData);

        expect(mockRepo.create).toHaveBeenCalledWith(inputData);
        expect(mockRepo.create).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedResult);
        expect(result.residentId).toBe("R123");
        expect(result.status).toBe("Scheduled");
      });

      it("should create request with optional notes field", async () => {
        const inputData = WasteRequestTestDataFactory.createValidInputData({
          notes: "Please handle with care"
        });
        const expectedResult = WasteRequestTestDataFactory.createMockWasteRequest({
          notes: "Please handle with care"
        });
        
        mockRepo.create.mockResolvedValue(expectedResult);

        const result = await service.createPickupRequest(inputData);

        expect(mockRepo.create).toHaveBeenCalledWith(inputData);
        expect(result.notes).toBe("Please handle with care");
      });

      it("should handle different waste types", async () => {
        const wasteTypes = ["Plastic", "Organic", "Electronic", "Paper"];
        
        for (const wasteType of wasteTypes) {
          const inputData = WasteRequestTestDataFactory.createValidInputData({ wasteType });
          const expectedResult = WasteRequestTestDataFactory.createMockWasteRequest({ wasteType });
          
          mockRepo.create.mockResolvedValue(expectedResult);

          const result = await service.createPickupRequest(inputData);

          expect(result.wasteType).toBe(wasteType);
          mockRepo.create.mockClear();
        }
      });
    });

    describe("Error Handling", () => {
      it("should propagate repository errors", async () => {
        const inputData = WasteRequestTestDataFactory.createValidInputData();
        const repositoryError = new Error("Database connection failed");
        
        mockRepo.create.mockRejectedValue(repositoryError);

        await expect(service.createPickupRequest(inputData))
          .rejects.toThrow("Database connection failed");
        
        expect(mockRepo.create).toHaveBeenCalledWith(inputData);
      });
    });
  });

  describe("getRequestsByResident", () => {
    describe("Success Cases", () => {
      it("should return requests for a specific resident", async () => {
        const residentId = "R123";
        const expectedRequests = WasteRequestTestDataFactory.createMultipleRequests(2);
        
        mockRepo.findByResident.mockResolvedValue(expectedRequests);

        const result = await service.getRequestsByResident(residentId);

        expect(mockRepo.findByResident).toHaveBeenCalledWith(residentId);
        expect(mockRepo.findByResident).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedRequests);
        expect(result).toHaveLength(2);
      });

      it("should return empty array when resident has no requests", async () => {
        const residentId = "R999";
        
        mockRepo.findByResident.mockResolvedValue([]);

        const result = await service.getRequestsByResident(residentId);

        expect(mockRepo.findByResident).toHaveBeenCalledWith(residentId);
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });

    describe("Error Handling", () => {
      it("should propagate repository errors", async () => {
        const residentId = "R123";
        const repositoryError = new Error("Database query failed");
        
        mockRepo.findByResident.mockRejectedValue(repositoryError);

        await expect(service.getRequestsByResident(residentId))
          .rejects.toThrow("Database query failed");
        
        expect(mockRepo.findByResident).toHaveBeenCalledWith(residentId);
      });
    });
  });

  describe("getAllRequests", () => {
    describe("Success Cases", () => {
      it("should return all waste requests", async () => {
        const expectedRequests = WasteRequestTestDataFactory.createMultipleRequests(5);
        
        mockRepo.findAll.mockResolvedValue(expectedRequests);

        const result = await service.getAllRequests();

        expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedRequests);
        expect(result).toHaveLength(5);
      });

      it("should return empty array when no requests exist", async () => {
        mockRepo.findAll.mockResolvedValue([]);

        const result = await service.getAllRequests();

        expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });

    describe("Error Handling", () => {
      it("should propagate repository errors", async () => {
        const repositoryError = new Error("Database connection timeout");
        
        mockRepo.findAll.mockRejectedValue(repositoryError);

        await expect(service.getAllRequests())
          .rejects.toThrow("Database connection timeout");
        
        expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Integration Tests", () => {
    it("should maintain consistent behavior across multiple operations", async () => {
      // Create a request
      const inputData = WasteRequestTestDataFactory.createValidInputData();
      const createdRequest = WasteRequestTestDataFactory.createMockWasteRequest();
      mockRepo.create.mockResolvedValue(createdRequest);

      const createResult = await service.createPickupRequest(inputData);
      expect(createResult).toEqual(createdRequest);

      // Get requests by resident
      const residentRequests = [createdRequest];
      mockRepo.findByResident.mockResolvedValue(residentRequests);

      const residentResult = await service.getRequestsByResident(inputData.residentId!);
      expect(residentResult).toEqual(residentRequests);

      // Get all requests
      const allRequests = [createdRequest, ...WasteRequestTestDataFactory.createMultipleRequests(2)];
      mockRepo.findAll.mockResolvedValue(allRequests);

      const allResult = await service.getAllRequests();
      expect(allResult).toEqual(allRequests);

      // Verify all methods were called
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.findByResident).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
