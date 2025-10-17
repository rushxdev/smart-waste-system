import { AnalyticsService } from "../../src/services/analytics.service";
import WasteRequest from "../../src/models/wasteRequest.model";
import Payment from "../../src/models/payment.model";
import Tracking from "../../src/models/wasteTracking.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the models
jest.mock("../../src/models/wasteRequest.model");
jest.mock("../../src/models/payment.model");
jest.mock("../../src/models/wasteTracking.model");

describe("AnalyticsService", () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
    jest.clearAllMocks();
  });

  describe("getDashboardSummary", () => {
    it("should return complete dashboard summary with all metrics", async () => {
      // Mock WasteRequest.countDocuments
      (WasteRequest.countDocuments as jest.Mock).mockResolvedValue(25);

      // Mock Tracking.countDocuments for completed requests
      (Tracking.countDocuments as jest.Mock).mockResolvedValue(15);

      // Mock Tracking.find for collected requests with populated data
      const mockCollectedRequests = [
        { wasteRequestId: { weight: 50 }, status: "Collected" },
        { wasteRequestId: { weight: 30 }, status: "Collected" },
        { wasteRequestId: { weight: 20 }, status: "Collected" }
      ];

      const mockTrackingFind = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCollectedRequests)
      };
      (Tracking.find as jest.Mock).mockReturnValue(mockTrackingFind);

      // Mock Payment.find
      const mockPayments = [
        { amount: 100 },
        { amount: 150 },
        { amount: 75 }
      ];
      (Payment.find as jest.Mock).mockResolvedValue(mockPayments);

      // Mock WasteRequest.aggregate for top waste types
      const mockTopWasteTypes = [
        { _id: "Plastic", count: 10 },
        { _id: "Organic", count: 8 },
        { _id: "Paper", count: 5 }
      ];
      (WasteRequest.aggregate as jest.Mock).mockResolvedValueOnce(mockTopWasteTypes);

      // Mock Payment.aggregate for monthly data
      const mockMonthlyPayments = [
        { _id: 1, payments: 500 },
        { _id: 3, payments: 750 }
      ];
      (Payment.aggregate as jest.Mock).mockResolvedValueOnce(mockMonthlyPayments);

      // Mock Tracking.aggregate for monthly waste
      const mockMonthlyWaste = [
        { _id: 1, waste: 100 },
        { _id: 3, waste: 150 }
      ];
      (Tracking.aggregate as jest.Mock).mockResolvedValueOnce(mockMonthlyWaste);

      const result = await analyticsService.getDashboardSummary();

      expect(result).toEqual({
        totalWasteCollected: 100, // 50 + 30 + 20
        totalRequests: 25,
        totalPayments: 325, // 100 + 150 + 75
        completedRequests: 15,
        topWasteTypes: mockTopWasteTypes,
        monthlyData: expect.arrayContaining([
          { month: "Jan", waste: 100, payments: 500 },
          { month: "Feb", waste: 0, payments: 0 },
          { month: "Mar", waste: 150, payments: 750 }
        ])
      });

      expect(WasteRequest.countDocuments).toHaveBeenCalled();
      expect(Tracking.countDocuments).toHaveBeenCalledWith({ status: "Collected" });
      expect(Tracking.find).toHaveBeenCalledWith({ status: "Collected" });
      expect(Payment.find).toHaveBeenCalled();
    });

    it("should handle zero collected requests", async () => {
      (WasteRequest.countDocuments as jest.Mock).mockResolvedValue(5);
      (Tracking.countDocuments as jest.Mock).mockResolvedValue(0);

      const mockTrackingFind = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      (Tracking.find as jest.Mock).mockReturnValue(mockTrackingFind);

      (Payment.find as jest.Mock).mockResolvedValue([]);
      (WasteRequest.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Payment.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Tracking.aggregate as jest.Mock).mockResolvedValueOnce([]);

      const result = await analyticsService.getDashboardSummary();

      expect(result.totalWasteCollected).toBe(0);
      expect(result.completedRequests).toBe(0);
      expect(result.totalPayments).toBe(0);
    });

    it("should handle null weight in collected requests", async () => {
      (WasteRequest.countDocuments as jest.Mock).mockResolvedValue(10);
      (Tracking.countDocuments as jest.Mock).mockResolvedValue(5);

      const mockCollectedRequests = [
        { wasteRequestId: { weight: 40 }, status: "Collected" },
        { wasteRequestId: null, status: "Collected" }, // No populated data
        { wasteRequestId: { weight: undefined }, status: "Collected" } // Undefined weight
      ];

      const mockTrackingFind = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCollectedRequests)
      };
      (Tracking.find as jest.Mock).mockReturnValue(mockTrackingFind);

      (Payment.find as jest.Mock).mockResolvedValue([{ amount: 200 }]);
      (WasteRequest.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Payment.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Tracking.aggregate as jest.Mock).mockResolvedValueOnce([]);

      const result = await analyticsService.getDashboardSummary();

      expect(result.totalWasteCollected).toBe(40); // Only the valid weight
    });

    it("should handle null/undefined payment amounts", async () => {
      (WasteRequest.countDocuments as jest.Mock).mockResolvedValue(10);
      (Tracking.countDocuments as jest.Mock).mockResolvedValue(5);

      const mockTrackingFind = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      (Tracking.find as jest.Mock).mockReturnValue(mockTrackingFind);

      const mockPayments = [
        { amount: 100 },
        { amount: null },
        { amount: undefined },
        { amount: 50 }
      ];
      (Payment.find as jest.Mock).mockResolvedValue(mockPayments);

      (WasteRequest.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Payment.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Tracking.aggregate as jest.Mock).mockResolvedValueOnce([]);

      const result = await analyticsService.getDashboardSummary();

      expect(result.totalPayments).toBe(150); // 100 + 0 + 0 + 50
    });

    it("should return 12 months of data with zeros for missing months", async () => {
      (WasteRequest.countDocuments as jest.Mock).mockResolvedValue(10);
      (Tracking.countDocuments as jest.Mock).mockResolvedValue(5);

      const mockTrackingFind = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      (Tracking.find as jest.Mock).mockReturnValue(mockTrackingFind);

      (Payment.find as jest.Mock).mockResolvedValue([]);
      (WasteRequest.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Payment.aggregate as jest.Mock).mockResolvedValueOnce([{ _id: 6, payments: 1000 }]);
      (Tracking.aggregate as jest.Mock).mockResolvedValueOnce([{ _id: 6, waste: 200 }]);

      const result = await analyticsService.getDashboardSummary();

      expect(result.monthlyData).toHaveLength(12);
      expect(result.monthlyData[5]).toEqual({ month: "Jun", waste: 200, payments: 1000 });
      expect(result.monthlyData[0]).toEqual({ month: "Jan", waste: 0, payments: 0 });
    });

    it("should limit top waste types to 5", async () => {
      (WasteRequest.countDocuments as jest.Mock).mockResolvedValue(50);
      (Tracking.countDocuments as jest.Mock).mockResolvedValue(30);

      const mockTrackingFind = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      (Tracking.find as jest.Mock).mockReturnValue(mockTrackingFind);

      (Payment.find as jest.Mock).mockResolvedValue([]);

      const mockTopWasteTypes = [
        { _id: "Plastic", count: 20 },
        { _id: "Organic", count: 15 },
        { _id: "Paper", count: 10 },
        { _id: "Glass", count: 3 },
        { _id: "Metal", count: 2 }
      ];
      (WasteRequest.aggregate as jest.Mock).mockResolvedValueOnce(mockTopWasteTypes);

      (Payment.aggregate as jest.Mock).mockResolvedValueOnce([]);
      (Tracking.aggregate as jest.Mock).mockResolvedValueOnce([]);

      const result = await analyticsService.getDashboardSummary();

      expect(result.topWasteTypes).toHaveLength(5);
      expect(result.topWasteTypes[0]._id).toBe("Plastic");
    });
  });
});
