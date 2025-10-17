import axiosInstance from "./axiosInstance";

// Payment interfaces following Single Responsibility Principle
export interface PaymentDetails {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentRequest {
  residentId: string;
  requestId: string;
  amount: number;
  method: "Card" | "Cash" | "Online";
  paymentDetails?: PaymentDetails;
}

export interface PaymentResponse {
  _id: string;
  wasteRequestId: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

// Service following Interface Segregation Principle
export const createPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  const res = await axiosInstance.post("/payments", data);
  return res.data;
};

export const getPaymentHistory = async (): Promise<PaymentResponse[]> => {
  const res = await axiosInstance.get("/payments/my");
  return res.data;
};
