import axiosInstance from "./axiosInstance";

export interface WasteRequest {
  _id?: string;
  residentId: string;
  address: string;
  wasteType: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  // include Pending and Collected to match front-end usage and back-end values
  status?: "Pending" | "Scheduled" | "Collected" | "Completed" | "Cancelled";
  workStatus?: "Not complete" | "Pending" | "In Progress" | "Completed";
  scheduleId?: string;
  collectorId?: string;
  residentName?: string;
  weight?: number;
  paymentStatus?: string;
  createdAt?: string;
}

export type CreateWasteRequest = Partial<Omit<WasteRequest, '_id' | 'status' | 'createdAt'>>;

export const createWasteRequest = async (data: CreateWasteRequest) => {
  const res = await axiosInstance.post("/waste-requests", data);
  return res.data;
};

export const getResidentWasteRequests = async () => {
  const res = await axiosInstance.get("/waste-requests/my");
  return res.data;
};

// Admin: get all waste requests
export const getAllWasteRequests = async () => {
  const res = await axiosInstance.get("/waste-requests");
  return res.data;
};

// Get waste requests assigned to a collector
export const getCollectorRequests = async (collectorId: string) => {
  console.log('[getCollectorRequests] Fetching requests for collectorId:', collectorId);
  const res = await axiosInstance.get(`/waste-requests/collector/${collectorId}`);
  console.log('[getCollectorRequests] Received data:', res.data);
  return res.data;
};

// Update work status of a waste request
export const updateWorkStatus = async (requestId: string, workStatus: string) => {
  const res = await axiosInstance.patch(`/waste-requests/${requestId}/work-status`, { workStatus });
  return res.data;
};

// Tracking interface for status tracking
export interface TrackingStatus {
  _id?: string;
  requestId: string;
  status: "Scheduled" | "In Progress" | "Collected";
  updatedBy: string;
  updatedAt: string;
}

// Get tracking status for a specific waste request
export const getTrackingStatus = async (requestId: string): Promise<TrackingStatus> => {
  const res = await axiosInstance.get(`/waste-tracking/${requestId}`);
  return res.data;
};