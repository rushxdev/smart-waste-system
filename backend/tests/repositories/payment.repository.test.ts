import { PaymentRepository } from "../../src/repositories/payment.repository";
import Payment, { type IPayment } from "../../src/models/payment.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the Payment model
jest.mock("../../src/models/payment.model");

describe("PaymentRepository", () => {
  let paymentRepository: PaymentRepository;

  beforeEach(() => {
    paymentRepository = new PaymentRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create and save a new payment", async () => {
      const paymentData = {
        residentId: "resident123",
        amount: 150,
        method: "Credit Card",
        status: "Completed"
      };

      const mockSavedPayment = {
        _id: "payment123",
        ...paymentData,
        save: jest.fn()
      } as unknown as IPayment;

      const mockSave = jest.fn().mockResolvedValue(mockSavedPayment);
      (Payment as unknown as jest.Mock).mockImplementation(() => ({
        ...mockSavedPayment,
        save: mockSave
      }));

      const result = await paymentRepository.create(paymentData);

      expect(Payment).toHaveBeenCalledWith(paymentData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockSavedPayment);
    });
  });

  describe("findByResident", () => {
    it("should find payments by resident ID", async () => {
      const mockPayments = [
        { _id: "payment1", residentId: "resident123", amount: 100 },
        { _id: "payment2", residentId: "resident123", amount: 200 }
      ] as IPayment[];

      (Payment.find as jest.Mock).mockResolvedValue(mockPayments);

      const result = await paymentRepository.findByResident("resident123");

      expect(Payment.find).toHaveBeenCalledWith({ residentId: "resident123" });
      expect(result).toEqual(mockPayments);
    });

    it("should return empty array when no payments found", async () => {
      (Payment.find as jest.Mock).mockResolvedValue([]);

      const result = await paymentRepository.findByResident("resident999");

      expect(result).toEqual([]);
    });
  });

  describe("findAll", () => {
    it("should return all payments", async () => {
      const mockPayments = [
        { _id: "payment1", amount: 100 },
        { _id: "payment2", amount: 200 },
        { _id: "payment3", amount: 300 }
      ] as IPayment[];

      (Payment.find as jest.Mock).mockResolvedValue(mockPayments);

      const result = await paymentRepository.findAll();

      expect(Payment.find).toHaveBeenCalled();
      expect(result).toEqual(mockPayments);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when no payments exist", async () => {
      (Payment.find as jest.Mock).mockResolvedValue([]);

      const result = await paymentRepository.findAll();

      expect(result).toEqual([]);
    });
  });
});
