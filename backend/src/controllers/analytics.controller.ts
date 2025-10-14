import type { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

const service = new AnalyticsService();

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const data = await service.getDashboardSummary();
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
