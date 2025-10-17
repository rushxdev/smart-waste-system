import { Schema, model, Document } from "mongoose";

export interface IWasteRequest extends Document {
  residentId: string;
  address: string;
  wasteType: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled";
  createdAt: Date;
}

const wasteRequestSchema = new Schema<IWasteRequest>({
  residentId: { type: String, required: true },
  address: { type: String, required: true },
  wasteType: { type: String, required: true },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ["Pending", "Scheduled", "Completed", "Cancelled"], default: "Pending", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IWasteRequest>("WasteRequest", wasteRequestSchema);
