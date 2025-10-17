import { Router } from "express";
import { WasteRequestController } from "../controllers/wasteRequest.controller";

const router = Router();

router.post("/", WasteRequestController.create);
router.get("/", WasteRequestController.getAll);
router.get("/:id", WasteRequestController.getByResident);
router.patch("/migrate-to-pending", WasteRequestController.migrateToPending);

export default router;