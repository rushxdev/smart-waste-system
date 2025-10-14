import { Schema, model, Document } from "mongoose";

export interface IPayment extends Document {
  residentId: string;
  requestId: string;
  amount: number;
  method: "Card" | "Cash" | "Online";
  status: "Pending" | "Completed" | "Failed";
  transactionId?: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  residentId: { type: String, required: true },
  requestId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["Card", "Cash", "Online"], required: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default model<IPayment>("Payment", paymentSchema);