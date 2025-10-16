import type { ISchedule } from "../models/schedule.model";
import { ScheduleRepository } from "../repositories/schedule.repository";

// Schedule Service (Business Logic Layer - Single Responsibility Principle)
export class ScheduleService {
  private repo: ScheduleRepository;

  constructor(repo: ScheduleRepository) {
    this.repo = repo;
  }

  // Create a new schedule with business validation
  async createSchedule(data: Partial<ISchedule>): Promise<ISchedule> {
    // Validate required fields
    if (!data.name || !data.date || !data.time || !data.city || !data.managerId) {
      throw new Error("Missing required fields: name, date, time, city, and managerId are required");
    }

    // Validate date is not in the past
    const scheduleDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (scheduleDate < today) {
      throw new Error("Schedule date cannot be in the past");
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.time)) {
      throw new Error("Time must be in HH:MM format");
    }

    // Check for same day and time validation
    if (scheduleDate.toDateString() === today.toDateString()) {
      const currentTime = new Date().toTimeString().slice(0, 5);
      if (data.time <= currentTime) {
        throw new Error("Time must be in the future for today's date");
      }
    }

    // Check for schedule conflicts
    const conflicts = await this.repo.checkConflict(data.date, data.time, data.city);
    if (conflicts.length > 0) {
      throw new Error(`Schedule conflict detected: Another schedule exists for ${data.city} at ${data.time} on ${data.date}`);
    }

    return await this.repo.create(data);
  }

  // Get schedule by ID
  async getScheduleById(id: string): Promise<ISchedule> {
    if (!id) {
      throw new Error("Schedule ID is required");
    }

    const schedule = await this.repo.findById(id);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    return schedule;
  }

  // Get all schedules with optional filtering
  async getAllSchedules(filters?: {
    managerId?: string;
    status?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ISchedule[]> {
    if (filters) {
      if (filters.managerId) {
        return await this.repo.findByManager(filters.managerId);
      }
      if (filters.status) {
        return await this.repo.findByStatus(filters.status);
      }
      if (filters.city) {
        return await this.repo.findByCity(filters.city);
      }
      if (filters.startDate && filters.endDate) {
        return await this.repo.findByDateRange(filters.startDate, filters.endDate);
      }
    }

    return await this.repo.findAll();
  }

  // Update schedule with business validation
  async updateSchedule(id: string, updateData: Partial<ISchedule>): Promise<ISchedule> {
    if (!id) {
      throw new Error("Schedule ID is required");
    }

    // Check if schedule exists
    const existingSchedule = await this.repo.findById(id);
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }

    // Prevent updating completed schedules
    if (existingSchedule.status === "Completed") {
      throw new Error("Cannot update completed schedules");
    }

    // Validate date if being updated
    if (updateData.date) {
      const scheduleDate = new Date(updateData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (scheduleDate < today) {
        throw new Error("Schedule date cannot be in the past");
      }
    }

    // Validate time format if being updated
    if (updateData.time) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(updateData.time)) {
        throw new Error("Time must be in HH:MM format");
      }
    }

    // Check for conflicts if date, time, or city are being updated
    if (updateData.date || updateData.time || updateData.city) {
      const dateToCheck = updateData.date || existingSchedule.date;
      const timeToCheck = updateData.time || existingSchedule.time;
      const cityToCheck = updateData.city || existingSchedule.city;

      const conflicts = await this.repo.checkConflict(dateToCheck, timeToCheck, cityToCheck, id);
      if (conflicts.length > 0) {
        throw new Error(`Schedule conflict detected: Another schedule exists for ${cityToCheck} at ${timeToCheck} on ${dateToCheck}`);
      }
    }

    const updatedSchedule = await this.repo.updateById(id, updateData);
    if (!updatedSchedule) {
      throw new Error("Failed to update schedule");
    }

    return updatedSchedule;
  }

  // Update schedule status
  async updateScheduleStatus(id: string, status: string): Promise<ISchedule> {
    if (!id) {
      throw new Error("Schedule ID is required");
    }

    const validStatuses = ["Scheduled", "In Progress", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    // Check if schedule exists
    const existingSchedule = await this.repo.findById(id);
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }

    // Business rules for status transitions
    if (existingSchedule.status === "Completed" && status !== "Completed") {
      throw new Error("Cannot change status of completed schedules");
    }

    if (existingSchedule.status === "Cancelled" && status === "In Progress") {
      throw new Error("Cannot start a cancelled schedule");
    }

    const updatedSchedule = await this.repo.updateStatus(id, status);
    if (!updatedSchedule) {
      throw new Error("Failed to update schedule status");
    }

    return updatedSchedule;
  }

  // Delete schedule with business validation
  async deleteSchedule(id: string): Promise<void> {
    if (!id) {
      throw new Error("Schedule ID is required");
    }

    const existingSchedule = await this.repo.findById(id);
    if (!existingSchedule) {
      throw new Error("Schedule not found");
    }

    // Prevent deletion of in-progress schedules
    if (existingSchedule.status === "In Progress") {
      throw new Error("Cannot delete schedules that are in progress");
    }

    const deletedSchedule = await this.repo.deleteById(id);
    if (!deletedSchedule) {
      throw new Error("Failed to delete schedule");
    }
  }

  // Get schedule statistics
  async getScheduleStatistics(managerId?: string): Promise<any> {
    return await this.repo.getStatistics(managerId);
  }

  // Get upcoming schedules
  async getUpcomingSchedules(managerId?: string): Promise<ISchedule[]> {
    return await this.repo.getUpcoming(managerId);
  }

  // Get schedules by manager
  async getSchedulesByManager(managerId: string): Promise<ISchedule[]> {
    if (!managerId) {
      throw new Error("Manager ID is required");
    }

    return await this.repo.findByManager(managerId);
  }
}