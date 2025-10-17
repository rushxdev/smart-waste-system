import { PaymentService } from "../../src/services/payment.service";
import { PaymentRepository } from "../../src/repositories/payment.repository";
import type { IPayment } from "../../src/models/payment.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the repository
jest.mock("../../src/repositories/payment.repository");

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let mockRepo: jest.Mocked<PaymentRepository>;

  // Helper to create mock payment
  const createMockPayment = (overrides: Partial<IPayment> = {}): IPayment => {
    return {
      _id: "payment123",
      residentId: "resident123",
      amount: 150.00,
      method: "Credit Card",
      status: "Completed",
      transactionId: "TXN-abc123",
      createdAt: new Date("2025-10-15T10:00:00Z"),
      updatedAt: new Date("2025-10-15T10:00:00Z"),
      save: jest.fn(),
      toObject: jest.fn(),
      toJSON: jest.fn(),
      ...overrides,
    } as unknown as IPayment;
  };

  beforeEach(() => {
    mockRepo = new PaymentRepository() as jest.Mocked<PaymentRepository>;
    paymentService = new PaymentService(mockRepo);
    jest.clearAllMocks();

    // Mock Math.random for consistent transaction ID generation
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("processPayment", () => {
    const validPaymentData = {
      residentId: "resident123",
      amount: 150.00,
      method: "Credit Card"
    };

    it("should process payment successfully with valid data", async () => {
      const mockPayment = createMockPayment();
      mockRepo.create.mockResolvedValue(mockPayment);

      const result = await paymentService.processPayment(validPaymentData);

      expect(mockRepo.create).toHaveBeenCalledWith({
        residentId: "resident123",
        amount: 150.00,
        method: "Credit Card",
        status: "Completed",
        transactionId: expect.stringContaining("TXN-")
      });
      expect(result).toEqual(mockPayment);
      expect(result.status).toBe("Completed");
    });

    it("should generate unique transaction ID", async () => {
      const mockPayment = createMockPayment();
      mockRepo.create.mockResolvedValue(mockPayment);

      await paymentService.processPayment(validPaymentData);

      const createCall = mockRepo.create.mock.calls[0][0];
      expect(createCall.transactionId).toMatch(/^TXN-[a-z0-9]+$/);
      expect(createCall.transactionId).toHaveLength(12); // TXN- (4 chars) + 8 random chars
    });

    it("should automatically set status to Completed", async () => {
      const mockPayment = createMockPayment();
      mockRepo.create.mockResolvedValue(mockPayment);

      await paymentService.processPayment(validPaymentData);

      const createCall = mockRepo.create.mock.calls[0][0];
      expect(createCall.status).toBe("Completed");
    });

    it("should throw error when residentId is missing", async () => {
      const invalidData = {
        amount: 150.00,
        method: "Credit Card"
      };

      await expect(paymentService.processPayment(invalidData)).rejects.toThrow(
        "Missing payment details"
      );

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("should throw error when amount is missing", async () => {
      const invalidData = {
        residentId: "resident123",
        method: "Credit Card"
      };

      await expect(paymentService.processPayment(invalidData)).rejects.toThrow(
        "Missing payment details"
      );

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("should throw error when method is missing", async () => {
      const invalidData = {
        residentId: "resident123",
        amount: 150.00
      };

      await expect(paymentService.processPayment(invalidData)).rejects.toThrow(
        "Missing payment details"
      );

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("should throw error when all required fields are missing", async () => {
      const invalidData = {};

      await expect(paymentService.processPayment(invalidData)).rejects.toThrow(
        "Missing payment details"
      );

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("should process payment with different payment methods", async () => {
      const paymentMethods = ["Credit Card", "Debit Card", "Cash", "Mobile Payment"];

      for (const method of paymentMethods) {
        const mockPayment = createMockPayment({ method });
        mockRepo.create.mockResolvedValue(mockPayment);

        const result = await paymentService.processPayment({
          ...validPaymentData,
          method
        });

        expect(result.method).toBe(method);
        mockRepo.create.mockClear();
      }
    });

    it("should process payment with different amounts", async () => {
      const amounts = [50.00, 100.00, 250.50, 1000.00];

      for (const amount of amounts) {
        const mockPayment = createMockPayment({ amount });
        mockRepo.create.mockResolvedValue(mockPayment);

        const result = await paymentService.processPayment({
          ...validPaymentData,
          amount
        });

        expect(result.amount).toBe(amount);
        mockRepo.create.mockClear();
      }
    });

    it("should handle repository errors", async () => {
      const repositoryError = new Error("Database connection failed");
      mockRepo.create.mockRejectedValue(repositoryError);

      await expect(paymentService.processPayment(validPaymentData)).rejects.toThrow(
        "Database connection failed"
      );

      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe("getPaymentsByResident", () => {
    it("should return payments for specific resident", async () => {
      const mockPayments = [
        createMockPayment({ _id: "payment1", amount: 100 }),
        createMockPayment({ _id: "payment2", amount: 200 })
      ];
      mockRepo.findByResident.mockResolvedValue(mockPayments);

      const result = await paymentService.getPaymentsByResident("resident123");

      expect(mockRepo.findByResident).toHaveBeenCalledWith("resident123");
      expect(result).toEqual(mockPayments);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when resident has no payments", async () => {
      mockRepo.findByResident.mockResolvedValue([]);

      const result = await paymentService.getPaymentsByResident("resident999");

      expect(mockRepo.findByResident).toHaveBeenCalledWith("resident999");
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle different resident IDs", async () => {
      const residentIds = ["resident1", "resident2", "resident3"];

      for (const residentId of residentIds) {
        const mockPayments = [createMockPayment({ residentId })];
        mockRepo.findByResident.mockResolvedValue(mockPayments);

        const result = await paymentService.getPaymentsByResident(residentId);

        expect(mockRepo.findByResident).toHaveBeenCalledWith(residentId);
        expect(result[0].residentId).toBe(residentId);
        mockRepo.findByResident.mockClear();
      }
    });

    it("should propagate repository errors", async () => {
      const repositoryError = new Error("Database query failed");
      mockRepo.findByResident.mockRejectedValue(repositoryError);

      await expect(paymentService.getPaymentsByResident("resident123")).rejects.toThrow(
        "Database query failed"
      );

      expect(mockRepo.findByResident).toHaveBeenCalledWith("resident123");
    });
  });

  describe("getAllPayments", () => {
    it("should return all payments", async () => {
      const mockPayments = [
        createMockPayment({ _id: "payment1", residentId: "resident1" }),
        createMockPayment({ _id: "payment2", residentId: "resident2" }),
        createMockPayment({ _id: "payment3", residentId: "resident3" })
      ];
      mockRepo.findAll.mockResolvedValue(mockPayments);

      const result = await paymentService.getAllPayments();

      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPayments);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when no payments exist", async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const result = await paymentService.getAllPayments();

      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return payments with different statuses", async () => {
      const mockPayments = [
        createMockPayment({ status: "Completed" }),
        createMockPayment({ status: "Pending" }),
        createMockPayment({ status: "Failed" })
      ];
      mockRepo.findAll.mockResolvedValue(mockPayments);

      const result = await paymentService.getAllPayments();

      expect(result).toHaveLength(3);
      expect(result.map(p => p.status)).toContain("Completed");
      expect(result.map(p => p.status)).toContain("Pending");
      expect(result.map(p => p.status)).toContain("Failed");
    });

    it("should propagate repository errors", async () => {
      const repositoryError = new Error("Database connection timeout");
      mockRepo.findAll.mockRejectedValue(repositoryError);

      await expect(paymentService.getAllPayments()).rejects.toThrow(
        "Database connection timeout"
      );

      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration workflow", () => {
    it("should handle complete payment workflow", async () => {
      // Step 1: Process a payment
      const paymentData = {
        residentId: "resident123",
        amount: 150.00,
        method: "Credit Card"
      };
      const mockPayment = createMockPayment();
      mockRepo.create.mockResolvedValue(mockPayment);

      const processedPayment = await paymentService.processPayment(paymentData);
      expect(processedPayment).toEqual(mockPayment);

      // Step 2: Retrieve payments by resident
      const residentPayments = [mockPayment];
      mockRepo.findByResident.mockResolvedValue(residentPayments);

      const residentResult = await paymentService.getPaymentsByResident("resident123");
      expect(residentResult).toEqual(residentPayments);

      // Step 3: Get all payments
      const allPayments = [mockPayment, createMockPayment({ _id: "payment2" })];
      mockRepo.findAll.mockResolvedValue(allPayments);

      const allResult = await paymentService.getAllPayments();
      expect(allResult).toEqual(allPayments);

      // Verify all methods were called
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.findByResident).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
