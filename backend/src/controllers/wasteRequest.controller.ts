import type { Request } from "express";
import type { Response } from "express";
import { WasteRequestService } from "../services/wasteRequest.service";
import { WasteRequestRepository } from "../repositories/wasteRequest.repository";
import User from "../models/user.model";
import WasteRequest from "../models/wasteRequest.model";

const repo = new WasteRequestRepository();
const service = new WasteRequestService(repo);

export class WasteRequestController {
  static async create(req: Request, res: Response) {
    try {
      // Ensure new requests start with 'Not complete' work status
      if (!req.body.workStatus) req.body.workStatus = "Not complete";
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

      // Resolve resident names from users collection
      const residentIds = Array.from(new Set(requests.map(r => r.residentId).filter(Boolean)));
      let users: any[] = [];
      if (residentIds.length > 0) {
        users = await User.find({ _id: { $in: residentIds } }).select("_id name").lean();
      }
      const userMap: Record<string, string> = {};
      users.forEach(u => { userMap[u._id] = u.name; });

      const withNames = requests.map(r => ({ ...r.toObject ? r.toObject() : r, residentName: userMap[r.residentId] || r.residentId }));
      res.status(200).json(withNames);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // PATCH /waste-requests/migrate-to-pending
  // Admin utility: convert WasteRequest documents that are marked Scheduled
  // but have no associated schedule (notes doesn't include scheduledId:) back to Pending
  static async migrateToPending(req: Request, res: Response) {
    try {
      // Criteria: status === 'Scheduled' AND (notes doesn't exist OR notes doesn't contain 'scheduledId:')
      const filter = {
        status: "Scheduled",
        $or: [
          { notes: { $exists: false } },
          { notes: { $not: /scheduledId:/ } }
        ]
      } as any;

      const result = await WasteRequest.updateMany(filter, { $set: { status: "Pending" } });
  const matched = (result as any).matchedCount ?? 0;
  const modified = (result as any).modifiedCount ?? 0;
  res.status(200).json({ success: true, matched, modified });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
