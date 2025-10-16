import type { ISchedule } from "../models/schedule.model";

// Mock Schedule Repository for testing without database
export class MockScheduleRepository {
  private schedules: ISchedule[] = [
    {
      _id: "6732456789abcdef12345678",
      name: "Morning Pickup - Downtown",
      date: "2025-10-18",
      time: "08:00",
      city: "Downtown",
      status: "Scheduled",
      managerId: "manager123",
      createdAt: new Date("2025-10-16T10:00:00Z"),
      updatedAt: new Date("2025-10-16T10:00:00Z"),
    } as ISchedule,
    {
      _id: "6732456789abcdef12345679",
      name: "Afternoon Collection - Uptown",
      date: "2025-10-17",
      time: "14:00",
      city: "Uptown",
      status: "In Progress",
      managerId: "manager123",
      createdAt: new Date("2025-10-16T09:00:00Z"),
      updatedAt: new Date("2025-10-16T13:00:00Z"),
    } as ISchedule,
  ];

  async create(data: Partial<ISchedule>): Promise<ISchedule> {
    const newSchedule = {
      _id: Date.now().toString(),
      name: data.name || "",
      date: data.date || "",
      time: data.time || "",
      city: data.city || "",
      status: "Scheduled" as const,
      managerId: data.managerId || "temp-manager-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ISchedule;
    
    this.schedules.push(newSchedule);
    return newSchedule;
  }

  async findAll(filters?: any): Promise<ISchedule[]> {
    return this.schedules;
  }

  async findById(id: string): Promise<ISchedule | null> {
    return this.schedules.find(s => s._id === id) || null;
  }

  async updateById(id: string, data: Partial<ISchedule>): Promise<ISchedule | null> {
    const index = this.schedules.findIndex(s => s._id === id);
    if (index === -1) return null;
    
    const updated = { ...this.schedules[index], ...data, updatedAt: new Date() } as ISchedule;
    this.schedules[index] = updated;
    return updated;
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.schedules.findIndex(s => s._id === id);
    if (index === -1) return false;
    
    this.schedules.splice(index, 1);
    return true;
  }

  async updateStatus(id: string, status: string): Promise<ISchedule | null> {
    return this.updateById(id, { status: status as any });
  }

  async checkConflict(date: string, time: string, city: string): Promise<ISchedule[]> {
    return this.schedules.filter(s => 
      s.date === date && s.time === time && s.city === city && s.status !== "Cancelled"
    );
  }

  async getStatistics(managerId?: string): Promise<any> {
    const filtered = managerId ? this.schedules.filter(s => s.managerId === managerId) : this.schedules;
    return {
      total: filtered.length,
      scheduled: filtered.filter(s => s.status === "Scheduled").length,
      inProgress: filtered.filter(s => s.status === "In Progress").length,
      completed: filtered.filter(s => s.status === "Completed").length,
      cancelled: filtered.filter(s => s.status === "Cancelled").length,
    };
  }

  async getUpcoming(managerId?: string): Promise<ISchedule[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.schedules.filter(s => {
      const scheduleDate = new Date(s.date);
      return scheduleDate >= now && scheduleDate <= nextWeek && 
             (!managerId || s.managerId === managerId);
    });
  }
}