import WasteRequest from "../models/wasteRequest.model.js";
import type { IWasteRequest } from "../models/wasteRequest.model.js";

export class WasteRequestRepository {
  async create(requestData: Partial<IWasteRequest>): Promise<IWasteRequest> {
    const request = new WasteRequest(requestData);
    return await request.save();
  }

  async findByResident(residentId: string): Promise<IWasteRequest[]> {
    return await WasteRequest.find({ residentId });
  }

  async findAll(): Promise<IWasteRequest[]> {
    return await WasteRequest.find();
  }
}
