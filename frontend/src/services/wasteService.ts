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

export const getCollectorRequests = async () => {
  const res = await axiosInstance.get("/tracking");
  return res.data;
};

export const updateRequestStatus = async (requestId: string, status: string) => {
  const res = await axiosInstance.put(`/tracking/${requestId}`, { status });
  return res.data;
};