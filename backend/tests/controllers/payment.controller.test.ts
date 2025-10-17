import { PaymentController } from "../../src/controllers/payment.controller";
import { PaymentService } from "../../src/services/payment.service";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the PaymentService
jest.mock("../../src/services/payment.service");
jest.mock("../../src/repositories/payment.repository");

describe("PaymentController", () => {
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
    it("should create payment and return 201", async () => {
      const paymentData = {
        residentId: "resident123",
        amount: 150,
        method: "Credit Card"
      };

      const mockPayment = {
        _id: "payment123",
        ...paymentData,
        status: "Completed",
        transactionId: "TXN-abc123"
      };

      mockRequest.body = paymentData;
      (PaymentService.prototype.processPayment as jest.Mock).mockResolvedValue(mockPayment);

      await PaymentController.create(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockPayment);
    });

    it("should return 400 on payment error", async () => {
      mockRequest.body = { amount: 150 };
      (PaymentService.prototype.processPayment as jest.Mock).mockRejectedValue(new Error("Missing payment details"));

      await PaymentController.create(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "Missing payment details" });
    });
  });

  describe("getByResident", () => {
    it("should get payments by resident and return 200", async () => {
      const mockPayments = [
        { _id: "payment1", residentId: "resident123", amount: 100 },
        { _id: "payment2", residentId: "resident123", amount: 200 }
      ];

      mockRequest.params = { residentId: "resident123" };
      (PaymentService.prototype.getPaymentsByResident as jest.Mock).mockResolvedValue(mockPayments);

      await PaymentController.getByResident(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockPayments);
    });

    it("should return 400 when residentId is missing", async () => {
      mockRequest.params = {};

      await PaymentController.getByResident(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "residentId parameter is required" });
    });

    it("should return 500 on service error", async () => {
      mockRequest.params = { residentId: "resident123" };
      (PaymentService.prototype.getPaymentsByResident as jest.Mock).mockRejectedValue(new Error("Database error"));

      await PaymentController.getByResident(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getAll", () => {
    it("should get all payments and return 200", async () => {
      const mockPayments = [
        { _id: "payment1", amount: 100 },
        { _id: "payment2", amount: 200 },
        { _id: "payment3", amount: 300 }
      ];

      (PaymentService.prototype.getAllPayments as jest.Mock).mockResolvedValue(mockPayments);

      await PaymentController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockPayments);
    });

    it("should return 500 on service error", async () => {
      (PaymentService.prototype.getAllPayments as jest.Mock).mockRejectedValue(new Error("Database error"));

      await PaymentController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
