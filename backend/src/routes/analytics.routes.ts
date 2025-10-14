import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/", AnalyticsController.getDashboard);

export default router;
