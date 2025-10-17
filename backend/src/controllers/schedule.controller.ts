import type { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";
import { MockScheduleRepository } from "../repositories/mock.schedule.repository";
import { WasteRequestRepository } from "../repositories/wasteRequest.repository";
import WasteRequest from "../models/wasteRequest.model";

const repo = new MockScheduleRepository();
const service = new ScheduleService(repo as any);
const wasteRequestRepo = new WasteRequestRepository();

// Schedule Controller (Presentation Layer - Single Responsibility Principle)
export class ScheduleController {
  
  // POST /schedules - Create a new schedule
  static async create(req: Request, res: Response) {
    try {
      const scheduleData = {
        ...req.body,
        managerId: req.body.managerId || "temp-manager-id" // In real app, get from auth middleware
      };

      const schedule = await service.createSchedule(scheduleData);
      res.status(201).json({
        success: true,
        message: "Schedule created successfully",
        data: schedule
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // GET /schedules - Get all schedules with optional filters
  static async getAll(req: Request, res: Response) {
    try {
      const filters = {
        managerId: req.query.managerId as string,
        status: req.query.status as string,
        city: req.query.city as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const schedules = await service.getAllSchedules(
        Object.keys(filters).length > 0 ? filters : undefined
      );

      res.status(200).json({
        success: true,
        message: "Schedules retrieved successfully",
        data: schedules,
        count: schedules.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // GET /schedules/:id - Get schedule by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Schedule ID is required",
          data: null
        });
      }

      const schedule = await service.getScheduleById(id);
      res.status(200).json({
        success: true,
        message: "Schedule retrieved successfully",
        data: schedule
      });
    } catch (error: any) {
      const statusCode = error.message === "Schedule not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // PUT /schedules/:id - Update schedule
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Schedule ID is required",
          data: null
        });
      }

      const schedule = await service.updateSchedule(id, req.body);
      res.status(200).json({
        success: true,
        message: "Schedule updated successfully",
        data: schedule
      });
    } catch (error: any) {
      const statusCode = error.message === "Schedule not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // PATCH /schedules/:id/status - Update schedule status
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Schedule ID is required",
          data: null
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
          data: null
        });
      }

      const schedule = await service.updateScheduleStatus(id, status);
      res.status(200).json({
        success: true,
        message: "Schedule status updated successfully",
        data: schedule
      });
    } catch (error: any) {
      const statusCode = error.message === "Schedule not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // DELETE /schedules/:id - Delete schedule
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Schedule ID is required",
          data: null
        });
      }

      await service.deleteSchedule(id);
      res.status(200).json({
        success: true,
        message: "Schedule deleted successfully",
        data: null
      });
    } catch (error: any) {
      const statusCode = error.message === "Schedule not found" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // GET /schedules/manager/:managerId - Get schedules by manager
  static async getByManager(req: Request, res: Response) {
    try {
      const { managerId } = req.params;

      if (!managerId) {
        return res.status(400).json({
          success: false,
          message: "Manager ID is required",
          data: null
        });
      }

      const schedules = await service.getSchedulesByManager(managerId);
      res.status(200).json({
        success: true,
        message: "Schedules retrieved successfully",
        data: schedules,
        count: schedules.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // GET /schedules/statistics - Get schedule statistics
  static async getStatistics(req: Request, res: Response) {
    try {
      const managerId = req.query.managerId as string;
      const statistics = await service.getScheduleStatistics(managerId);
      
      res.status(200).json({
        success: true,
        message: "Statistics retrieved successfully",
        data: statistics
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // GET /schedules/upcoming - Get upcoming schedules
  static async getUpcoming(req: Request, res: Response) {
    try {
      const managerId = req.query.managerId as string;
      const schedules = await service.getUpcomingSchedules(managerId);
      
      res.status(200).json({
        success: true,
        message: "Upcoming schedules retrieved successfully",
        data: schedules,
        count: schedules.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // POST /schedules/from-requests - Create schedule from selected waste requests
  static async createFromRequests(req: Request, res: Response) {
    try {
      const { requestIds, name, date, time, city, managerId } = req.body;

      if (!Array.isArray(requestIds) || requestIds.length === 0) {
        return res.status(400).json({ success: false, message: "requestIds array is required", data: null });
      }

      // Create schedule using existing service logic
      const scheduleData = { name, date, time, city, managerId };
      const schedule = await service.createSchedule(scheduleData as any);

      // Update each waste request status to "Scheduled" and attach scheduleId
      const updatedRequests = [] as any[];
      for (const id of requestIds) {
        const reqDoc = await WasteRequest.findById(id);
        if (!reqDoc) continue;
        reqDoc.status = "Scheduled" as any;
        // Optionally store schedule id in notes or another field; use notes append
        reqDoc.notes = `${reqDoc.notes || ""} | scheduledId:${(schedule as any)._id}`;
        const saved = await reqDoc.save();
        updatedRequests.push(saved);
      }

      res.status(201).json({ success: true, message: "Schedule created and requests updated", data: { schedule, updatedRequests } });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message, data: null });
    }
  }
}