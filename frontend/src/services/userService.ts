import axiosInstance from "./axiosInstance";

export const getUsersByRole = async (role: string) => {
  const res = await axiosInstance.get(`/users?role=${encodeURIComponent(role)}`);
  return res.data;
};
