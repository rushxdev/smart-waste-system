import { WasteTrackingRepository } from "../repositories/wasteTracking.repository";
import type { ITracking } from "../models/wasteTracking.model";

export class WasteTrackingService {
  private repo: WasteTrackingRepository;

  constructor(repo: WasteTrackingRepository) {
    this.repo = repo;
  }

  async getStatusByRequestId(requestId: string): Promise<ITracking | null> {
    const tracking = await this.repo.findByRequestId(requestId);
    if (!tracking) throw new Error("No tracking record found for this request");
    return tracking;
  }

  async updateTrackingStatus(requestId: string, status: string, collectorId: any): Promise<ITracking> {
    const allowedStatuses = ["Scheduled", "In Progress", "Collected"];
    if (!allowedStatuses.includes(status)) throw new Error("Invalid status");
    return await this.repo.updateStatus(requestId, status, collectorId);
  }
}
