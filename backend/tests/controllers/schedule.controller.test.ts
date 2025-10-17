import { ScheduleController } from "../../src/controllers/schedule.controller";
import { ScheduleService } from "../../src/services/schedule.service";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the ScheduleService
jest.mock("../../src/services/schedule.service");
jest.mock("../../src/repositories/schedule.repository");

describe("ScheduleController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  const mockSchedule = {
    _id: "schedule123",
    name: "Morning Collection",
    date: "2025-10-20",
    time: "08:00",
    city: "Downtown",
    status: "Scheduled",
    managerId: "manager123"
  };

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      body: {},
      params: {},
      query: {}
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create schedule and return 201", async () => {
      mockRequest.body = {
        name: "Morning Collection",
        date: "2025-10-20",
        time: "08:00",
        city: "Downtown"
      };

      (ScheduleService.prototype.createSchedule as jest.Mock).mockResolvedValue(mockSchedule);

      await ScheduleController.create(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Schedule created successfully",
        data: mockSchedule
      });
    });

    it("should return 400 on validation error", async () => {
      mockRequest.body = { name: "Test" };
      (ScheduleService.prototype.createSchedule as jest.Mock).mockRejectedValue(new Error("Missing required fields"));

      await ScheduleController.create(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Missing required fields",
        data: null
      });
    });
  });

  describe("getAll", () => {
    it("should get all schedules and return 200", async () => {
      const mockSchedules = [mockSchedule];
      (ScheduleService.prototype.getAllSchedules as jest.Mock).mockResolvedValue(mockSchedules);

      await ScheduleController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Schedules retrieved successfully",
        data: mockSchedules,
        count: 1
      });
    });

    it("should filter schedules by query params", async () => {
      mockRequest.query = { status: "Scheduled", city: "Downtown" };
      const mockSchedules = [mockSchedule];
      (ScheduleService.prototype.getAllSchedules as jest.Mock).mockResolvedValue(mockSchedules);

      await ScheduleController.getAll(mockRequest as Request, mockResponse as Response);

      expect(ScheduleService.prototype.getAllSchedules).toHaveBeenCalledWith({
        status: "Scheduled",
        city: "Downtown"
      });
    });
  });

  describe("getById", () => {
    it("should get schedule by ID and return 200", async () => {
      mockRequest.params = { id: "schedule123" };
      (ScheduleService.prototype.getScheduleById as jest.Mock).mockResolvedValue(mockSchedule);

      await ScheduleController.getById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Schedule retrieved successfully",
        data: mockSchedule
      });
    });

    it("should return 400 when ID is missing", async () => {
      mockRequest.params = {};

      await ScheduleController.getById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 404 when schedule not found", async () => {
      mockRequest.params = { id: "nonexistent" };
      (ScheduleService.prototype.getScheduleById as jest.Mock).mockRejectedValue(new Error("Schedule not found"));

      await ScheduleController.getById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });
  });

  describe("update", () => {
    it("should update schedule and return 200", async () => {
      mockRequest.params = { id: "schedule123" };
      mockRequest.body = { name: "Updated Collection" };
      (ScheduleService.prototype.updateSchedule as jest.Mock).mockResolvedValue(mockSchedule);

      await ScheduleController.update(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 400 when ID is missing", async () => {
      mockRequest.params = {};

      await ScheduleController.update(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("updateStatus", () => {
    it("should update schedule status and return 200", async () => {
      mockRequest.params = { id: "schedule123" };
      mockRequest.body = { status: "Completed" };
      (ScheduleService.prototype.updateScheduleStatus as jest.Mock).mockResolvedValue(mockSchedule);

      await ScheduleController.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 400 when status is missing", async () => {
      mockRequest.params = { id: "schedule123" };
      mockRequest.body = {};

      await ScheduleController.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("delete", () => {
    it("should delete schedule and return 200", async () => {
      mockRequest.params = { id: "schedule123" };
      (ScheduleService.prototype.deleteSchedule as jest.Mock).mockResolvedValue(undefined);

      await ScheduleController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 400 when ID is missing", async () => {
      mockRequest.params = {};

      await ScheduleController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("getByManager", () => {
    it("should get schedules by manager and return 200", async () => {
      mockRequest.params = { managerId: "manager123" };
      const mockSchedules = [mockSchedule];
      (ScheduleService.prototype.getSchedulesByManager as jest.Mock).mockResolvedValue(mockSchedules);

      await ScheduleController.getByManager(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 400 when managerId is missing", async () => {
      mockRequest.params = {};

      await ScheduleController.getByManager(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("getStatistics", () => {
    it("should get statistics and return 200", async () => {
      const mockStats = { total: 10, scheduled: 5 };
      (ScheduleService.prototype.getScheduleStatistics as jest.Mock).mockResolvedValue(mockStats);

      await ScheduleController.getStatistics(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });

  describe("getUpcoming", () => {
    it("should get upcoming schedules and return 200", async () => {
      const mockSchedules = [mockSchedule];
      (ScheduleService.prototype.getUpcomingSchedules as jest.Mock).mockResolvedValue(mockSchedules);

      await ScheduleController.getUpcoming(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 on service error", async () => {
      (ScheduleService.prototype.getUpcomingSchedules as jest.Mock).mockRejectedValue(new Error("Database error"));

      await ScheduleController.getUpcoming(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
        data: null
      });
    });
  });

  describe("getAll error handling", () => {
    it("should return 500 on service error", async () => {
      (ScheduleService.prototype.getAllSchedules as jest.Mock).mockRejectedValue(new Error("Database error"));

      await ScheduleController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
        data: null
      });
    });
  });

  describe("update error handling", () => {
    it("should return 404 when schedule not found", async () => {
      mockRequest.params = { id: "nonexistent" };
      mockRequest.body = { name: "Updated" };
      (ScheduleService.prototype.updateSchedule as jest.Mock).mockRejectedValue(new Error("Schedule not found"));

      await ScheduleController.update(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it("should return 400 on validation error", async () => {
      mockRequest.params = { id: "schedule123" };
      mockRequest.body = { name: "Updated" };
      (ScheduleService.prototype.updateSchedule as jest.Mock).mockRejectedValue(new Error("Invalid data"));

      await ScheduleController.update(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("updateStatus error handling", () => {
    it("should return 400 when ID is missing", async () => {
      mockRequest.params = {};
      mockRequest.body = { status: "Completed" };

      await ScheduleController.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 404 when schedule not found", async () => {
      mockRequest.params = { id: "nonexistent" };
      mockRequest.body = { status: "Completed" };
      (ScheduleService.prototype.updateScheduleStatus as jest.Mock).mockRejectedValue(new Error("Schedule not found"));

      await ScheduleController.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });
  });

  describe("delete error handling", () => {
    it("should return 404 when schedule not found", async () => {
      mockRequest.params = { id: "nonexistent" };
      (ScheduleService.prototype.deleteSchedule as jest.Mock).mockRejectedValue(new Error("Schedule not found"));

      await ScheduleController.delete(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });
  });

  describe("getByManager error handling", () => {
    it("should return 500 on service error", async () => {
      mockRequest.params = { managerId: "manager123" };
      (ScheduleService.prototype.getSchedulesByManager as jest.Mock).mockRejectedValue(new Error("Database error"));

      await ScheduleController.getByManager(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("getStatistics error handling", () => {
    it("should return 500 on service error", async () => {
      (ScheduleService.prototype.getScheduleStatistics as jest.Mock).mockRejectedValue(new Error("Database error"));

      await ScheduleController.getStatistics(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });
});
