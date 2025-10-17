import axiosInstance from "./axiosInstance";

export interface WasteRequest {
  residentName: string;
  _id?: string;
  residentId?: string;
  wasteType: string;
  weight: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
}

export const createWasteRequest = async (data: WasteRequest) => {
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