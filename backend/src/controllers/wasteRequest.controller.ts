import type { Request } from "express";
import type { Response } from "express";
import { WasteRequestService } from "../services/wasteRequest.service";
import { WasteRequestRepository } from "../repositories/wasteRequest.repository";

const repo = new WasteRequestRepository();
const service = new WasteRequestService(repo);

export class WasteRequestController {
  static async create(req: Request, res: Response) {
    try {
      const request = await service.createPickupRequest(req.body);
      res.status(201).json(request);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getByResident(req: Request, res: Response) {
    try {
      const residentId = req.params.id;
      if (!residentId) {
        return res.status(400).json({ message: "Resident ID is required." });
      }
      const requests = await service.getRequestsByResident(residentId);
      res.status(200).json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const requests = await service.getAllRequests();
      res.status(200).json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
