import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.post("/", PaymentController.create);
router.get("/:residentId", PaymentController.getByResident);
router.get("/", PaymentController.getAll); // For admin analytics

// save card
router.post("/card", PaymentController.saveCard);



export default router;
