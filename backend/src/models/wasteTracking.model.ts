import { Schema, model, Document } from "mongoose";

export interface ITracking extends Document {
  requestId: string;
  status: "Scheduled" | "In Progress" | "Collected";
  updatedBy: string; // Collector ID
  updatedAt: Date;
}

const trackingSchema = new Schema<ITracking>({
  requestId: { type: String, required: true },
  status: { type: String, enum: ["Scheduled", "In Progress", "Collected"], required: true },
  updatedBy: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default model<ITracking>("Tracking", trackingSchema);
