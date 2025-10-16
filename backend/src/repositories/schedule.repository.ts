import Schedule from "../models/schedule.model.js";
import type { ISchedule } from "../models/schedule.model.js";

// Schedule Repository (Repository Pattern - Dependency Inversion Principle)
export class ScheduleRepository {
  
  // Create a new schedule
  async create(scheduleData: Partial<ISchedule>): Promise<ISchedule> {
    const schedule = new Schedule(scheduleData);
    return await schedule.save();
  }

  // Find schedule by ID
  async findById(id: string): Promise<ISchedule | null> {
    return await Schedule.findById(id);
  }

  // Find all schedules
  async findAll(): Promise<ISchedule[]> {
    return await Schedule.find().sort({ createdAt: -1 });
  }

  // Find schedules by manager ID
  async findByManager(managerId: string): Promise<ISchedule[]> {
    return await Schedule.find({ managerId }).sort({ date: 1, time: 1 });
  }

  // Find schedules by status
  async findByStatus(status: string): Promise<ISchedule[]> {
    return await Schedule.find({ status }).sort({ date: 1, time: 1 });
  }

  // Find schedules by date range
  async findByDateRange(startDate: string, endDate: string): Promise<ISchedule[]> {
    return await Schedule.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1, time: 1 });
  }

  // Find schedules by city
  async findByCity(city: string): Promise<ISchedule[]> {
    return await Schedule.find({ 
      city: { $regex: new RegExp(city, 'i') } 
    }).sort({ date: 1, time: 1 });
  }

  // Update schedule by ID
  async updateById(id: string, updateData: Partial<ISchedule>): Promise<ISchedule | null> {
    return await Schedule.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );
  }

  // Update schedule status
  async updateStatus(id: string, status: string): Promise<ISchedule | null> {
    return await Schedule.findByIdAndUpdate(
      id, 
      { status, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );
  }

  // Delete schedule by ID
  async deleteById(id: string): Promise<ISchedule | null> {
    return await Schedule.findByIdAndDelete(id);
  }

  // Check if schedule conflicts with existing schedules
  async checkConflict(date: string, time: string, city: string, excludeId?: string): Promise<ISchedule[]> {
    const query: any = {
      date,
      time,
      city: { $regex: new RegExp(city, 'i') },
      status: { $in: ["Scheduled", "In Progress"] }
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return await Schedule.find(query);
  }

  // Get schedule statistics
  async getStatistics(managerId?: string): Promise<any> {
    const matchStage = managerId ? { managerId } : {};

    return await Schedule.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          statusCounts: {
            $push: {
              status: "$_id",
              count: "$count"
            }
          }
        }
      }
    ]);
  }

  // Get upcoming schedules (next 7 days)
  async getUpcoming(managerId?: string): Promise<ISchedule[]> {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const query: any = {
      date: { $gte: today, $lte: nextWeek },
      status: { $in: ["Scheduled", "In Progress"] }
    };

    if (managerId) {
      query.managerId = managerId;
    }

    return await Schedule.find(query).sort({ date: 1, time: 1 });
  }
}