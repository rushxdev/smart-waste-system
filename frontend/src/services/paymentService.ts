import axiosInstance from "./axiosInstance";

export interface CardDetails {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
}

export interface PaymentRequest {
  wasteType: string;
  pickupDateTime: string;
  serviceFee: number;
  ecoCoinsApplied: number;
  paymentMethod: string;
  finalAmount: number;
}

export const saveCard = async (card: CardDetails): Promise<void> => {
  await axiosInstance.post("payment/card", card);
};

export const processPayment = async (payment: PaymentRequest): Promise<void> => {
  await axiosInstance.post("payment/process", payment);
};