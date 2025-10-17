import { Schema, model, Document } from "mongoose";

export interface IWasteRequest extends Document {
  residentId: string;
  address: string;
  wasteType: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  workStatus?: "Not complete" | "Pending" | "In Progress" | "Completed";
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled";
  scheduleId?: string;
  collectorId?: string;
  createdAt: Date;
}

const wasteRequestSchema = new Schema<IWasteRequest>({
  residentId: { type: String, required: true },
  address: { type: String, required: true },
  wasteType: { type: String, required: true },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  notes: { type: String },
  workStatus: { type: String, enum: ["Not complete", "Pending", "In Progress", "Completed"], default: "Not complete" },
  status: { type: String, enum: ["Pending", "Scheduled", "Completed", "Cancelled"], default: "Pending", required: true },
  scheduleId: { type: String },
  collectorId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default model<IWasteRequest>("WasteRequest", wasteRequestSchema);
