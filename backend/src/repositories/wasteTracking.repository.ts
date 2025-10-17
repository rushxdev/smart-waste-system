import Tracking, { type ITracking } from "../models/wasteTracking.model";

export class WasteTrackingRepository {
  async findByRequestId(requestId: string): Promise<ITracking | null> {
    return await Tracking.findOne({ requestId });
  }

  async updateStatus(requestId: string, status: string, updatedBy?: string): Promise<ITracking> {
    const existing = await Tracking.findOne({ requestId });
    if (existing) {
      existing.status = status as any;
      if (updatedBy) existing.updatedBy = updatedBy;
      existing.updatedAt = new Date();
      return await existing.save();
    }
    const newTracking = new Tracking({ requestId, status, updatedBy });
    return await newTracking.save();
  }
}
