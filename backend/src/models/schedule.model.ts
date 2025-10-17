import { Schema, model, Document } from "mongoose";

export interface ISchedule extends Document {
  _id: string;
  name: string;
  date: string;
  time: string;
  city: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  managerId: string;
  collectorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>({
  name: { 
    type: String, 
    required: [true, "Schedule name is required"],
    trim: true,
    minlength: [3, "Schedule name must be at least 3 characters long"],
    maxlength: [100, "Schedule name cannot exceed 100 characters"]
  },
  date: { 
    type: String, 
    required: [true, "Date is required"],
    validate: {
      validator: function(v: string) {
        // Validate that date is not in the past
        const scheduleDate = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return scheduleDate >= today;
      },
      message: "Date cannot be in the past"
    }
  },
  time: { 
    type: String, 
    required: [true, "Time is required"],
    validate: {
      validator: function(v: string) {
        // Validate HH:MM format
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: "Time must be in HH:MM format"
    }
  },
  city: { 
    type: String, 
    required: [true, "City is required"],
    trim: true,
    minlength: [2, "City name must be at least 2 characters long"],
    maxlength: [50, "City name cannot exceed 50 characters"]
  },
  status: { 
    type: String, 
    enum: {
      values: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      message: "{VALUE} is not a valid status"
    },
    default: "Scheduled", 
    required: true 
  },
  managerId: {
    type: String,
    required: [true, "Manager ID is required"]
  },
  collectorId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
scheduleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes for better query performance
scheduleSchema.index({ managerId: 1 });
scheduleSchema.index({ date: 1 });
scheduleSchema.index({ status: 1 });
scheduleSchema.index({ createdAt: -1 });

export default model<ISchedule>("Schedule", scheduleSchema);