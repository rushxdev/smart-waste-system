import axiosInstance from "./axiosInstance";
import type { NewSchedule } from "../features/waste/types/teamOverview.types";

export interface Schedule {
  _id: string;
  name: string;
  date: string;
  time: string;
  city: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

// Schedule Service for API communication
export class ScheduleService {
  private static readonly BASE_URL = "/schedules";

  // Create a new schedule
  static async createSchedule(scheduleData: NewSchedule): Promise<Schedule> {
    try {
      const response = await axiosInstance.post<ApiResponse<Schedule>>(
        this.BASE_URL,
        scheduleData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create schedule");
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create schedule. Please try again.");
    }
  }

  // Get all schedules with optional filters
  static async getAllSchedules(filters?: {
    managerId?: string;
    status?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Schedule[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await axiosInstance.get<ApiResponse<Schedule[]>>(
        `${this.BASE_URL}?${params.toString()}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch schedules");
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch schedules. Please try again.");
    }
  }

  // Get schedule by ID
  static async getScheduleById(id: string): Promise<Schedule> {
    try {
      const response = await axiosInstance.get<ApiResponse<Schedule>>(
        `${this.BASE_URL}/${id}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Schedule not found");
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch schedule. Please try again.");
    }
  }

  // Update schedule
  static async updateSchedule(id: string, updateData: Partial<NewSchedule>): Promise<Schedule> {
    try {
      const response = await axiosInstance.put<ApiResponse<Schedule>>(
        `${this.BASE_URL}/${id}`,
        updateData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update schedule");
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update schedule. Please try again.");
    }
  }

  // Update schedule status
  static async updateScheduleStatus(id: string, status: string): Promise<Schedule> {
    try {
      const response = await axiosInstance.patch<ApiResponse<Schedule>>(
        `${this.BASE_URL}/${id}/status`,
        { status }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update schedule status");
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update schedule status. Please try again.");
    }
  }

  // Delete schedule
  static async deleteSchedule(id: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `${this.BASE_URL}/${id}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete schedule");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete schedule. Please try again.");
    }
  }

  // Get upcoming schedules
  static async getUpcomingSchedules(managerId?: string): Promise<Schedule[]> {
    try {
      const params = managerId ? `?managerId=${managerId}` : "";
      const response = await axiosInstance.get<ApiResponse<Schedule[]>>(
        `${this.BASE_URL}/upcoming${params}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch upcoming schedules");
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch upcoming schedules. Please try again.");
    }
  }

  // Get schedule statistics
  static async getScheduleStatistics(managerId?: string): Promise<{
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const params = managerId ? `?managerId=${managerId}` : "";
      const response = await axiosInstance.get<ApiResponse<any>>(
        `${this.BASE_URL}/statistics${params}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch statistics");
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch statistics. Please try again.");
    }
  }

    // Create schedule from selected waste request IDs
    static async createFromRequests(payload: {
      requestIds: string[];
      name: string;
      date: string;
      time: string;
      city: string;
      managerId?: string;
    }): Promise<any> {
      try {
        const response = await axiosInstance.post<ApiResponse<any>>(`${this.BASE_URL}/from-requests`, payload);
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create schedule from requests");
        }
        return response.data.data;
      } catch (error: any) {
        if (error.response?.data?.message) throw new Error(error.response.data.message);
        throw new Error("Failed to create schedule from requests. Please try again.");
      }
    }
}