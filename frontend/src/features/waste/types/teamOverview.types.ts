// Types and interfaces for Team Overview components (Interface Segregation Principle)

export interface Collector {
  id: number;
  name: string;
  zone: string;
  status: "Active" | "On Break" | "Offline";
  collections: number;
  rating: number;
}

export interface Schedule {
  _id: string; // Changed from id to _id to match MongoDB/API format
  name: string;
  date: string;
  time: string;
  city: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"; // Added Cancelled status
  managerId: string; // Added managerId field
  createdAt: string; // Added createdAt field
  updatedAt: string; // Added updatedAt field
  
  // For backward compatibility with existing components that expect 'id'
  id?: string | number;
}

export interface NewSchedule {
  name: string;
  date: string;
  time: string;
  city: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

// Props interfaces for components
export interface CollectorsTableProps {
  collectors: Collector[];
}

export interface SchedulesTableProps {
  schedules: Schedule[];
  onCreateSchedule: () => void;
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: NewSchedule) => Promise<void>; // Made async to handle API calls
  editingSchedule?: Schedule | null; // Optional schedule to edit
}

export interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}