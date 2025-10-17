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

  // GET /waste-requests/my - Get requests for the authenticated user
  static async getMyRequests(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.sub) {
        return res.status(401).json({ message: "Unauthorized. User not authenticated." });
      }
      const residentId = user.sub;
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

  // GET /waste-requests/collector/:collectorId - Get requests assigned to a collector
  static async getCollectorRequests(req: Request, res: Response) {
    try {
      const { collectorId } = req.params;
      if (!collectorId) {
        return res.status(400).json({ message: "Collector ID is required" });
      }

      const requests = await WasteRequest.find({ collectorId }).sort({ preferredDate: 1, preferredTime: 1 });

      // Resolve resident names
      const residentIds = Array.from(new Set(requests.map(r => r.residentId).filter(Boolean)));
      let users: any[] = [];
      if (residentIds.length > 0) {
        users = await User.find({ _id: { $in: residentIds } }).select("_id name").lean();
      }
      const userMap: Record<string, string> = {};
      users.forEach(u => { userMap[u._id] = u.name; });

      const withNames = requests.map(r => ({ ...r.toObject(), residentName: userMap[r.residentId] || r.residentId }));
      res.status(200).json(withNames);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // PATCH /waste-requests/:id/work-status - Update work status
  static async updateWorkStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { workStatus } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Request ID is required" });
      }

      if (!workStatus) {
        return res.status(400).json({ message: "Work status is required" });
      }

      const allowedStatuses = ["Not complete", "Pending", "In Progress", "Completed"];
      if (!allowedStatuses.includes(workStatus)) {
        return res.status(400).json({ message: "Invalid work status" });
      }

      const request = await WasteRequest.findByIdAndUpdate(
        id,
        { workStatus },
        { new: true, runValidators: true }
      );

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.status(200).json(request);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // PATCH /waste-requests/fix-collector-assignments - Fix missing collectorId in scheduled requests
  static async fixCollectorAssignments(req: Request, res: Response) {
    try {
      const Schedule = (await import("../models/schedule.model")).default;

      // Find all scheduled waste requests without collectorId
      const scheduledRequests = await WasteRequest.find({
        status: "Scheduled",
        $or: [
          { collectorId: { $exists: false } },
          { collectorId: null },
          { collectorId: "" }
        ]
      });

      console.log(`[fixCollectorAssignments] Found ${scheduledRequests.length} requests without collectorId`);

      let fixed = 0;
      let notFixed = 0;

      for (const request of scheduledRequests) {
        if (request.scheduleId) {
          // Try to find the schedule and get collectorId from it
          const schedule = await Schedule.findById(request.scheduleId);
          if (schedule && schedule.collectorId) {
            request.collectorId = schedule.collectorId;
            await request.save();
            console.log(`[fixCollectorAssignments] Fixed request ${request._id} with collectorId ${schedule.collectorId}`);
            fixed++;
          } else {
            console.log(`[fixCollectorAssignments] Schedule ${request.scheduleId} has no collectorId`);
            notFixed++;
          }
        } else {
          console.log(`[fixCollectorAssignments] Request ${request._id} has no scheduleId`);
          notFixed++;
        }
      }

      res.status(200).json({
        message: "Collector assignments fixed",
        total: scheduledRequests.length,
        fixed,
        notFixed
      });
    } catch (error: any) {
      console.error('[fixCollectorAssignments] Error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}
