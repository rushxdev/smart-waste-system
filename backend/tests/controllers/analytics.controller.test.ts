import { AnalyticsController } from "../../src/controllers/analytics.controller";
import { AnalyticsService } from "../../src/services/analytics.service";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the AnalyticsService
jest.mock("../../src/services/analytics.service");

describe("AnalyticsController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {};

    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe("getDashboard", () => {
    it("should get dashboard summary and return 200", async () => {
      const mockDashboardData = {
        totalWasteCollected: 500,
        totalRequests: 25,
        totalPayments: 1500,
        completedRequests: 15,
        topWasteTypes: [
          { _id: "Plastic", count: 10 },
          { _id: "Organic", count: 8 }
        ],
        monthlyData: [
          { month: "Jan", waste: 100, payments: 500 },
          { month: "Feb", waste: 150, payments: 600 }
        ]
      };

      (AnalyticsService.prototype.getDashboardSummary as jest.Mock).mockResolvedValue(mockDashboardData);

      await AnalyticsController.getDashboard(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockDashboardData);
    });

    it("should return 500 on service error", async () => {
      (AnalyticsService.prototype.getDashboardSummary as jest.Mock).mockRejectedValue(new Error("Database error"));

      await AnalyticsController.getDashboard(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
