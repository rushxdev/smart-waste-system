import { Router } from "express";
import { WasteRequestController } from "../controllers/wasteRequest.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", WasteRequestController.create);
router.get("/", WasteRequestController.getAll);
router.get("/my", authenticate, WasteRequestController.getMyRequests); // Must come before /:id
router.get("/collector/:collectorId", WasteRequestController.getCollectorRequests);
router.patch("/migrate-to-pending", WasteRequestController.migrateToPending);
router.patch("/fix-collector-assignments", WasteRequestController.fixCollectorAssignments);
router.patch("/:id/work-status", WasteRequestController.updateWorkStatus);
router.get("/:id", WasteRequestController.getByResident);

export default router;