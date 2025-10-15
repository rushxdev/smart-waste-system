import axiosInstance from "./axiosInstance";

export interface AnalyticsData {
  totalWasteCollected: number;
  totalRequests: number;
  totalPayments: number;
  monthlyData: { month: string; waste: number; payments: number }[];
}

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  const res = await axiosInstance.get("/analytics");
  return res.data;
};
