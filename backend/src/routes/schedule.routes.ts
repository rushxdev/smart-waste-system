import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";

const router = Router();

// Schedule Routes (Route Definition - Open/Closed Principle)

// POST /api/schedules - Create a new schedule
router.post("/", ScheduleController.create);
// POST /api/schedules/from-requests - Create a schedule from selected waste requests
router.post("/from-requests", ScheduleController.createFromRequests);

// GET /api/schedules - Get all schedules with optional filters
// Query parameters: managerId, status, city, startDate, endDate
router.get("/", ScheduleController.getAll);

// GET /api/schedules/statistics - Get schedule statistics
// Query parameters: managerId (optional)
router.get("/statistics", ScheduleController.getStatistics);

// GET /api/schedules/upcoming - Get upcoming schedules (next 7 days)
// Query parameters: managerId (optional)
router.get("/upcoming", ScheduleController.getUpcoming);

// GET /api/schedules/manager/:managerId - Get schedules by manager
router.get("/manager/:managerId", ScheduleController.getByManager);

// GET /api/schedules/:id - Get schedule by ID
router.get("/:id", ScheduleController.getById);

// PUT /api/schedules/:id - Update schedule
router.put("/:id", ScheduleController.update);

// PATCH /api/schedules/:id/status - Update schedule status
router.patch("/:id/status", ScheduleController.updateStatus);

// DELETE /api/schedules/:id - Delete schedule
router.delete("/:id", ScheduleController.delete);

export default router;