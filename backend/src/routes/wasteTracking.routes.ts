import { Router } from "express";
import { WasteTrackingController } from "../controllers/wasteTracking.controller";

const router = Router();

router.get("/:requestId", WasteTrackingController.getStatus);
router.put("/:requestId", WasteTrackingController.updateStatus);

export default router;
