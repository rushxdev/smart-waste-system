// Schedule-related types and interfaces (Interface Segregation Principle)

export interface CreateScheduleRequest {
  name: string;
  date: string;
  time: string;
  city: string;
  managerId?: string;
}

export interface UpdateScheduleRequest {
  name?: string;
  date?: string;
  time?: string;
  city?: string;
  status?: ScheduleStatus;
}

export interface UpdateScheduleStatusRequest {
  status: ScheduleStatus;
}

export interface ScheduleFilters {
  managerId?: string;
  status?: ScheduleStatus;
  city?: string;
  startDate?: string;
  endDate?: string;
}

export interface ScheduleResponse {
  _id: string;
  name: string;
  date: string;
  time: string;
  city: string;
  status: ScheduleStatus;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleStatistics {
  total: number;
  statusCounts: Array<{
    status: ScheduleStatus;
    count: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  count?: number;
}

export type ScheduleStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

export interface ScheduleConflict {
  conflictingSchedule: ScheduleResponse;
  message: string;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface TimeValidation {
  isValidFormat: boolean;
  isFutureTime: boolean;
  message?: string;
}

export interface DateValidation {
  isValidDate: boolean;
  isFutureDate: boolean;
  message?: string;
}

// Query parameter types
export interface ScheduleQueryParams {
  managerId?: string;
  status?: ScheduleStatus;
  city?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'time' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Repository method types
export interface ScheduleRepositoryInterface {
  create(scheduleData: Partial<CreateScheduleRequest>): Promise<ScheduleResponse>;
  findById(id: string): Promise<ScheduleResponse | null>;
  findAll(): Promise<ScheduleResponse[]>;
  findByManager(managerId: string): Promise<ScheduleResponse[]>;
  findByStatus(status: ScheduleStatus): Promise<ScheduleResponse[]>;
  findByDateRange(startDate: string, endDate: string): Promise<ScheduleResponse[]>;
  findByCity(city: string): Promise<ScheduleResponse[]>;
  updateById(id: string, updateData: Partial<UpdateScheduleRequest>): Promise<ScheduleResponse | null>;
  updateStatus(id: string, status: ScheduleStatus): Promise<ScheduleResponse | null>;
  deleteById(id: string): Promise<ScheduleResponse | null>;
  checkConflict(date: string, time: string, city: string, excludeId?: string): Promise<ScheduleResponse[]>;
  getStatistics(managerId?: string): Promise<ScheduleStatistics>;
  getUpcoming(managerId?: string): Promise<ScheduleResponse[]>;
}

// Service method types
export interface ScheduleServiceInterface {
  createSchedule(data: CreateScheduleRequest): Promise<ScheduleResponse>;
  getScheduleById(id: string): Promise<ScheduleResponse>;
  getAllSchedules(filters?: ScheduleFilters): Promise<ScheduleResponse[]>;
  updateSchedule(id: string, updateData: UpdateScheduleRequest): Promise<ScheduleResponse>;
  updateScheduleStatus(id: string, status: ScheduleStatus): Promise<ScheduleResponse>;
  deleteSchedule(id: string): Promise<void>;
  getScheduleStatistics(managerId?: string): Promise<ScheduleStatistics>;
  getUpcomingSchedules(managerId?: string): Promise<ScheduleResponse[]>;
  getSchedulesByManager(managerId: string): Promise<ScheduleResponse[]>;
}