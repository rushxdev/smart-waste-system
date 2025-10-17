import { ScheduleService } from "../../src/services/schedule.service";
import { ScheduleRepository } from "../../src/repositories/schedule.repository";
import type { ISchedule } from "../../src/models/schedule.model";
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the repository
jest.mock("../../src/repositories/schedule.repository");

describe("ScheduleService", () => {
  let scheduleService: ScheduleService;
  let mockRepository: jest.Mocked<ScheduleRepository>;

  // Helper function to create mock schedule objects
  const createMockSchedule = (overrides: Partial<ISchedule> = {}): ISchedule => {
    return {
      _id: "60d5ec4b6bfec61c64b90b01",
      name: "Morning Collection",
      date: "2025-10-20",
      time: "08:00",
      city: "Downtown",
      status: "Scheduled",
      managerId: "manager123",
      createdAt: new Date("2025-10-16T10:00:00Z"),
      updatedAt: new Date("2025-10-16T10:00:00Z"),
      // Mock Mongoose Document methods
      save: jest.fn(),
      toObject: jest.fn(),
      toJSON: jest.fn(),
      ...overrides,
    } as unknown as ISchedule;
  };

  const mockSchedule: ISchedule = createMockSchedule();

  beforeEach(() => {
    mockRepository = new ScheduleRepository() as jest.Mocked<ScheduleRepository>;
    scheduleService = new ScheduleService(mockRepository);
    jest.clearAllMocks();
  });

  describe("createSchedule", () => {
    const validScheduleData = {
      name: "Morning Collection",
      date: "2025-10-20",
      time: "08:00",
      city: "Downtown",
      managerId: "manager123"
    };

    it("should create a schedule successfully with valid data", async () => {
      mockRepository.checkConflict.mockResolvedValue([]);
      mockRepository.create.mockResolvedValue(mockSchedule);

      const result = await scheduleService.createSchedule(validScheduleData);

      expect(mockRepository.checkConflict).toHaveBeenCalledWith("2025-10-20", "08:00", "Downtown");
      expect(mockRepository.create).toHaveBeenCalledWith(validScheduleData);
      expect(result).toEqual(mockSchedule);
    });

    it("should throw error when required fields are missing", async () => {
      const invalidData = {
        name: "Morning Collection"
        // Missing required fields
      };

      await expect(scheduleService.createSchedule(invalidData)).rejects.toThrow(
        "Missing required fields: name, date, time, city, and managerId are required"
      );
    });

    it("should throw error when date is in the past", async () => {
      const pastDateData = {
        ...validScheduleData,
        date: "2020-01-01" // Clearly in the past
      };

      await expect(scheduleService.createSchedule(pastDateData)).rejects.toThrow(
        "Schedule date cannot be in the past"
      );
    });

    it("should throw error when time format is invalid", async () => {
      const invalidTimeData = {
        ...validScheduleData,
        time: "25:00" // Invalid time
      };

      await expect(scheduleService.createSchedule(invalidTimeData)).rejects.toThrow(
        "Time must be in HH:MM format"
      );
    });

    it("should throw error when schedule conflict exists", async () => {
      mockRepository.checkConflict.mockResolvedValue([mockSchedule]);

      await expect(scheduleService.createSchedule(validScheduleData)).rejects.toThrow(
        "Schedule conflict detected: Another schedule exists for Downtown at 08:00 on 2025-10-20"
      );
    });

    it("should throw error when time is in the past for today's date", async () => {
      // Get today's date dynamically
      const today = new Date();
      const todayString: string = today.toISOString().split('T')[0] as string; // Format: YYYY-MM-DD

      // Use a time that's definitely in the past (early morning)
      const todayData = {
        ...validScheduleData,
        date: todayString,
        time: "01:00" // 1:00 AM - very early time that should be in the past
      };

      // Mock empty conflicts for this test since we want to test time validation
      mockRepository.checkConflict.mockResolvedValue([]);

      await expect(scheduleService.createSchedule(todayData)).rejects.toThrow(
        "Time must be in the future for today's date"
      );
    });
  });

  describe("getScheduleById", () => {
    it("should return schedule when found", async () => {
      mockRepository.findById.mockResolvedValue(mockSchedule);

      const result = await scheduleService.getScheduleById("60d5ec4b6bfec61c64b90b01");

      expect(mockRepository.findById).toHaveBeenCalledWith("60d5ec4b6bfec61c64b90b01");
      expect(result).toEqual(mockSchedule);
    });

    it("should throw error when schedule not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(scheduleService.getScheduleById("nonexistent")).rejects.toThrow(
        "Schedule not found"
      );
    });

    it("should throw error when ID is not provided", async () => {
      await expect(scheduleService.getScheduleById("")).rejects.toThrow(
        "Schedule ID is required"
      );
    });
  });

  describe("updateSchedule", () => {
    const updateData = {
      name: "Updated Morning Collection",
      time: "09:00"
    };

    it("should update schedule successfully", async () => {
      const updatedSchedule = createMockSchedule({ ...updateData });
      
      mockRepository.findById.mockResolvedValue(mockSchedule);
      mockRepository.checkConflict.mockResolvedValue([]);
      mockRepository.updateById.mockResolvedValue(updatedSchedule);

      const result = await scheduleService.updateSchedule("60d5ec4b6bfec61c64b90b01", updateData);

      expect(mockRepository.findById).toHaveBeenCalledWith("60d5ec4b6bfec61c64b90b01");
      expect(mockRepository.updateById).toHaveBeenCalledWith("60d5ec4b6bfec61c64b90b01", updateData);
      expect(result).toEqual(updatedSchedule);
    });

    it("should throw error when schedule not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(scheduleService.updateSchedule("nonexistent", updateData)).rejects.toThrow(
        "Schedule not found"
      );
    });

    it("should throw error when trying to update completed schedule", async () => {
      const completedSchedule = createMockSchedule({ status: "Completed" });
      mockRepository.findById.mockResolvedValue(completedSchedule);

      await expect(scheduleService.updateSchedule("60d5ec4b6bfec61c64b90b01", updateData)).rejects.toThrow(
        "Cannot update completed schedules"
      );
    });

    it("should check for conflicts when updating date, time, or city", async () => {
      const conflictUpdateData = {
        date: "2025-10-21",
        time: "10:00",
        city: "Riverside"
      };

      mockRepository.findById.mockResolvedValue(mockSchedule);
      mockRepository.checkConflict.mockResolvedValue([]);
      mockRepository.updateById.mockResolvedValue(createMockSchedule({ ...conflictUpdateData }));

      await scheduleService.updateSchedule("60d5ec4b6bfec61c64b90b01", conflictUpdateData);

      expect(mockRepository.checkConflict).toHaveBeenCalledWith(
        "2025-10-21",
        "10:00",
        "Riverside",
        "60d5ec4b6bfec61c64b90b01"
      );
    });

    it("should throw error when updating date to the past", async () => {
      const pastDateUpdateData = {
        date: "2020-01-01"
      };

      mockRepository.findById.mockResolvedValue(mockSchedule);

      await expect(scheduleService.updateSchedule("60d5ec4b6bfec61c64b90b01", pastDateUpdateData)).rejects.toThrow(
        "Schedule date cannot be in the past"
      );
    });

    it("should throw error when updating time format is invalid", async () => {
      const invalidTimeUpdateData = {
        time: "25:00"
      };

      mockRepository.findById.mockResolvedValue(mockSchedule);

      await expect(scheduleService.updateSchedule("60d5ec4b6bfec61c64b90b01", invalidTimeUpdateData)).rejects.toThrow(
        "Time must be in HH:MM format"
      );
    });

    it("should throw error when update conflict exists", async () => {
      const conflictUpdateData = {
        date: "2025-10-21",
        time: "10:00"
      };

      mockRepository.findById.mockResolvedValue(mockSchedule);
      mockRepository.checkConflict.mockResolvedValue([createMockSchedule({ _id: "different-id" })]);

      await expect(scheduleService.updateSchedule("60d5ec4b6bfec61c64b90b01", conflictUpdateData)).rejects.toThrow(
        "Schedule conflict detected: Another schedule exists for Downtown at 10:00 on 2025-10-21"
      );
    });
  });

  describe("updateScheduleStatus", () => {
    it("should update status successfully", async () => {
      const updatedSchedule = createMockSchedule({ status: "In Progress" });
      
      mockRepository.findById.mockResolvedValue(mockSchedule);
      mockRepository.updateStatus.mockResolvedValue(updatedSchedule);

      const result = await scheduleService.updateScheduleStatus("60d5ec4b6bfec61c64b90b01", "In Progress");

      expect(mockRepository.findById).toHaveBeenCalledWith("60d5ec4b6bfec61c64b90b01");
      expect(mockRepository.updateStatus).toHaveBeenCalledWith("60d5ec4b6bfec61c64b90b01", "In Progress");
      expect(result).toEqual(updatedSchedule);
    });

    it("should throw error for invalid status", async () => {
      await expect(scheduleService.updateScheduleStatus("60d5ec4b6bfec61c64b90b01", "Invalid Status")).rejects.toThrow(
        "Invalid status. Must be one of: Scheduled, In Progress, Completed, Cancelled"
      );
    });

    it("should throw error when trying to change completed schedule status", async () => {
      const completedSchedule = createMockSchedule({ status: "Completed" });
      mockRepository.findById.mockResolvedValue(completedSchedule);

      await expect(scheduleService.updateScheduleStatus("60d5ec4b6bfec61c64b90b01", "Scheduled")).rejects.toThrow(
        "Cannot change status of completed schedules"
      );
    });

    it("should throw error when trying to start cancelled schedule", async () => {
      const cancelledSchedule = createMockSchedule({ status: "Cancelled" });
      mockRepository.findById.mockResolvedValue(cancelledSchedule);

      await expect(scheduleService.updateScheduleStatus("60d5ec4b6bfec61c64b90b01", "In Progress")).rejects.toThrow(
        "Cannot start a cancelled schedule"
      );
    });
  });

  describe("deleteSchedule", () => {
    it("should delete schedule successfully", async () => {
      mockRepository.findById.mockResolvedValue(mockSchedule);
      mockRepository.deleteById.mockResolvedValue(mockSchedule);

      await scheduleService.deleteSchedule("60d5ec4b6bfec61c64b90b01");

      expect(mockRepository.findById).toHaveBeenCalledWith("60d5ec4b6bfec61c64b90b01");
      expect(mockRepository.deleteById).toHaveBeenCalledWith("60d5ec4b6bfec61c64b90b01");
    });

    it("should throw error when schedule not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(scheduleService.deleteSchedule("nonexistent")).rejects.toThrow(
        "Schedule not found"
      );
    });

    it("should throw error when trying to delete in-progress schedule", async () => {
      const inProgressSchedule = createMockSchedule({ status: "In Progress" });
      mockRepository.findById.mockResolvedValue(inProgressSchedule);

      await expect(scheduleService.deleteSchedule("60d5ec4b6bfec61c64b90b01")).rejects.toThrow(
        "Cannot delete schedules that are in progress"
      );
    });
  });

  describe("getAllSchedules", () => {
    it("should return all schedules when no filters provided", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.findAll.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getAllSchedules();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockSchedules);
    });

    it("should filter by manager when managerId provided", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.findByManager.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getAllSchedules({ managerId: "manager123" });

      expect(mockRepository.findByManager).toHaveBeenCalledWith("manager123");
      expect(result).toEqual(mockSchedules);
    });

    it("should filter by status when status provided", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.findByStatus.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getAllSchedules({ status: "Scheduled" });

      expect(mockRepository.findByStatus).toHaveBeenCalledWith("Scheduled");
      expect(result).toEqual(mockSchedules);
    });

    it("should filter by city when city provided", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.findByCity.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getAllSchedules({ city: "Downtown" });

      expect(mockRepository.findByCity).toHaveBeenCalledWith("Downtown");
      expect(result).toEqual(mockSchedules);
    });

    it("should filter by date range when startDate and endDate provided", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.findByDateRange.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getAllSchedules({
        startDate: "2025-10-01",
        endDate: "2025-10-31"
      });

      expect(mockRepository.findByDateRange).toHaveBeenCalledWith("2025-10-01", "2025-10-31");
      expect(result).toEqual(mockSchedules);
    });
  });

  describe("getSchedulesByManager", () => {
    it("should return schedules for specific manager", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.findByManager.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getSchedulesByManager("manager123");

      expect(mockRepository.findByManager).toHaveBeenCalledWith("manager123");
      expect(result).toEqual(mockSchedules);
    });

    it("should throw error when managerId is not provided", async () => {
      await expect(scheduleService.getSchedulesByManager("")).rejects.toThrow(
        "Manager ID is required"
      );
    });
  });

  describe("getScheduleStatistics", () => {
    it("should return statistics for all managers", async () => {
      const mockStats = {
        total: 10,
        scheduled: 5,
        inProgress: 3,
        completed: 2,
        cancelled: 0
      };
      mockRepository.getStatistics.mockResolvedValue(mockStats);

      const result = await scheduleService.getScheduleStatistics();

      expect(mockRepository.getStatistics).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockStats);
    });

    it("should return statistics for specific manager", async () => {
      const mockStats = {
        total: 5,
        scheduled: 3,
        inProgress: 1,
        completed: 1,
        cancelled: 0
      };
      mockRepository.getStatistics.mockResolvedValue(mockStats);

      const result = await scheduleService.getScheduleStatistics("manager123");

      expect(mockRepository.getStatistics).toHaveBeenCalledWith("manager123");
      expect(result).toEqual(mockStats);
    });
  });

  describe("getUpcomingSchedules", () => {
    it("should return upcoming schedules for all managers", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.getUpcoming.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getUpcomingSchedules();

      expect(mockRepository.getUpcoming).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockSchedules);
    });

    it("should return upcoming schedules for specific manager", async () => {
      const mockSchedules = [mockSchedule];
      mockRepository.getUpcoming.mockResolvedValue(mockSchedules);

      const result = await scheduleService.getUpcomingSchedules("manager123");

      expect(mockRepository.getUpcoming).toHaveBeenCalledWith("manager123");
      expect(result).toEqual(mockSchedules);
    });
  });
});