import type { IWasteRequest } from "../models/wasteRequest.model";
import { WasteRequestRepository } from "../repositories/wasteRequest.repository";

export class WasteRequestService {
  private repo: WasteRequestRepository;

  constructor(repo: WasteRequestRepository) {
    this.repo = repo;
  }

  async createPickupRequest(data: Partial<IWasteRequest>): Promise<IWasteRequest> {
    if (!data.residentId || !data.address || !data.wasteType) {
      throw new Error("Missing required fields");
    }

    // Here you can add business logic such as slot availability or pricing
    return await this.repo.create(data);
  }

  async getRequestsByResident(residentId: string): Promise<IWasteRequest[]> {
    return await this.repo.findByResident(residentId);
  }

  async getAllRequests(): Promise<IWasteRequest[]> {
    return await this.repo.findAll();
  }
}
