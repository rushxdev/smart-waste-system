import type { Request, Response } from "express";
import { WasteTrackingRepository } from "../repositories/wasteTracking.repository";
import { WasteTrackingService } from "../services/wasteTracking.service";

const repo = new WasteTrackingRepository();
const service = new WasteTrackingService(repo);

export class WasteTrackingController {
  static async getStatus(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      if (!requestId) {
        return res.status(400).json({ message: "Missing requestId parameter" });
      }
      const tracking = await service.getStatusByRequestId(requestId);
      res.status(200).json(tracking);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { status, collectorId } = req.body;
      const { requestId } = req.params;
      if (!requestId) {
        return res.status(400).json({ message: "Missing requestId parameter" });
      }
      const tracking = await service.updateTrackingStatus(requestId, status, collectorId);
      res.status(200).json(tracking);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
