import { ScheduleRepository } from "../../src/repositories/schedule.repository";
import Schedule, { type ISchedule } from "../../src/models/schedule.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the Schedule model
jest.mock("../../src/models/schedule.model");

describe("ScheduleRepository", () => {
  let scheduleRepository: ScheduleRepository;

  const mockSchedule = {
    _id: "schedule123",
    name: "Morning Collection",
    date: "2025-10-20",
    time: "08:00",
    city: "Downtown",
    status: "Scheduled",
    managerId: "manager123"
  } as ISchedule;

  beforeEach(() => {
    scheduleRepository = new ScheduleRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create and save a new schedule", async () => {
      const scheduleData = {
        name: "Morning Collection",
        date: "2025-10-20",
        time: "08:00",
        city: "Downtown",
        managerId: "manager123"
      };

      const mockSave = jest.fn().mockResolvedValue(mockSchedule);
      (Schedule as unknown as jest.Mock).mockImplementation(() => ({
        ...mockSchedule,
        save: mockSave
      }));

      const result = await scheduleRepository.create(scheduleData);

      expect(Schedule).toHaveBeenCalledWith(scheduleData);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should find schedule by ID", async () => {
      (Schedule.findById as jest.Mock).mockResolvedValue(mockSchedule);

      const result = await scheduleRepository.findById("schedule123");

      expect(Schedule.findById).toHaveBeenCalledWith("schedule123");
      expect(result).toEqual(mockSchedule);
    });
  });

  describe("findAll", () => {
    it("should return all schedules sorted by createdAt", async () => {
      const mockSort = jest.fn().mockResolvedValue([mockSchedule]);
      (Schedule.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await scheduleRepository.findAll();

      expect(Schedule.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  describe("findByManager", () => {
    it("should find schedules by manager ID", async () => {
      const mockSort = jest.fn().mockResolvedValue([mockSchedule]);
      (Schedule.find as jest.Mock).mockReturnValue({ sort: mockSort });

      await scheduleRepository.findByManager("manager123");

      expect(Schedule.find).toHaveBeenCalledWith({ managerId: "manager123" });
      expect(mockSort).toHaveBeenCalledWith({ date: 1, time: 1 });
    });
  });

  describe("findByStatus", () => {
    it("should find schedules by status", async () => {
      const mockSort = jest.fn().mockResolvedValue([mockSchedule]);
      (Schedule.find as jest.Mock).mockReturnValue({ sort: mockSort });

      await scheduleRepository.findByStatus("Scheduled");

      expect(Schedule.find).toHaveBeenCalledWith({ status: "Scheduled" });
    });
  });

  describe("findByDateRange", () => {
    it("should find schedules by date range", async () => {
      const mockSort = jest.fn().mockResolvedValue([mockSchedule]);
      (Schedule.find as jest.Mock).mockReturnValue({ sort: mockSort });

      await scheduleRepository.findByDateRange("2025-10-01", "2025-10-31");

      expect(Schedule.find).toHaveBeenCalledWith({
        date: { $gte: "2025-10-01", $lte: "2025-10-31" }
      });
    });
  });

  describe("findByCity", () => {
    it("should find schedules by city with case-insensitive regex", async () => {
      const mockSort = jest.fn().mockResolvedValue([mockSchedule]);
      (Schedule.find as jest.Mock).mockReturnValue({ sort: mockSort });

      await scheduleRepository.findByCity("Downtown");

      expect(Schedule.find).toHaveBeenCalledWith({
        city: { $regex: expect.any(RegExp) }
      });
    });
  });

  describe("updateById", () => {
    it("should update schedule by ID", async () => {
      (Schedule.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockSchedule);

      const updateData = { name: "Updated Collection" };
      await scheduleRepository.updateById("schedule123", updateData);

      expect(Schedule.findByIdAndUpdate).toHaveBeenCalledWith(
        "schedule123",
        { ...updateData, updatedAt: expect.any(Date) },
        { new: true, runValidators: true }
      );
    });
  });

  describe("updateStatus", () => {
    it("should update schedule status", async () => {
      (Schedule.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockSchedule);

      await scheduleRepository.updateStatus("schedule123", "Completed");

      expect(Schedule.findByIdAndUpdate).toHaveBeenCalledWith(
        "schedule123",
        { status: "Completed", updatedAt: expect.any(Date) },
        { new: true, runValidators: true }
      );
    });
  });

  describe("deleteById", () => {
    it("should delete schedule by ID", async () => {
      (Schedule.findByIdAndDelete as jest.Mock).mockResolvedValue(mockSchedule);

      await scheduleRepository.deleteById("schedule123");

      expect(Schedule.findByIdAndDelete).toHaveBeenCalledWith("schedule123");
    });
  });

  describe("checkConflict", () => {
    it("should check for conflicts without excludeId", async () => {
      (Schedule.find as jest.Mock).mockResolvedValue([]);

      await scheduleRepository.checkConflict("2025-10-20", "08:00", "Downtown");

      expect(Schedule.find).toHaveBeenCalledWith({
        date: "2025-10-20",
        time: "08:00",
        city: { $regex: expect.any(RegExp) },
        status: { $in: ["Scheduled", "In Progress"] }
      });
    });

    it("should check for conflicts with excludeId", async () => {
      (Schedule.find as jest.Mock).mockResolvedValue([]);

      await scheduleRepository.checkConflict("2025-10-20", "08:00", "Downtown", "schedule123");

      expect(Schedule.find).toHaveBeenCalledWith({
        date: "2025-10-20",
        time: "08:00",
        city: { $regex: expect.any(RegExp) },
        status: { $in: ["Scheduled", "In Progress"] },
        _id: { $ne: "schedule123" }
      });
    });
  });

  describe("getStatistics", () => {
    it("should get statistics without managerId", async () => {
      (Schedule.aggregate as jest.Mock).mockResolvedValue([{ total: 10 }]);

      await scheduleRepository.getStatistics();

      expect(Schedule.aggregate).toHaveBeenCalledWith([
        { $match: {} },
        expect.any(Object),
        expect.any(Object)
      ]);
    });

    it("should get statistics with managerId", async () => {
      (Schedule.aggregate as jest.Mock).mockResolvedValue([{ total: 5 }]);

      await scheduleRepository.getStatistics("manager123");

      expect(Schedule.aggregate).toHaveBeenCalledWith([
        { $match: { managerId: "manager123" } },
        expect.any(Object),
        expect.any(Object)
      ]);
    });
  });

  describe("getUpcoming", () => {
    it("should get upcoming schedules without managerId", async () => {
      const mockSort = jest.fn().mockResolvedValue([mockSchedule]);
      (Schedule.find as jest.Mock).mockReturnValue({ sort: mockSort });

      await scheduleRepository.getUpcoming();

      expect(Schedule.find).toHaveBeenCalledWith({
        date: { $gte: expect.any(String), $lte: expect.any(String) },
        status: { $in: ["Scheduled", "In Progress"] }
      });
    });

    it("should get upcoming schedules with managerId", async () => {
      const mockSort = jest.fn().mockResolvedValue([mockSchedule]);
      (Schedule.find as jest.Mock).mockReturnValue({ sort: mockSort });

      await scheduleRepository.getUpcoming("manager123");

      expect(Schedule.find).toHaveBeenCalledWith({
        date: { $gte: expect.any(String), $lte: expect.any(String) },
        status: { $in: ["Scheduled", "In Progress"] },
        managerId: "manager123"
      });
    });
  });
});
