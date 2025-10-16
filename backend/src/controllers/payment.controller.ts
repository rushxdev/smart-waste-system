import type { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { PaymentRepository } from "../repositories/payment.repository";
import { CardService } from "../services/card.service";
import { CardRepository } from "../repositories/card.repository";

const repo = new PaymentRepository();
const service = new PaymentService(repo);

const cardRepo = new CardRepository();
const cardService = new CardService(cardRepo);

export class PaymentController {
  static async create(req: Request, res: Response) {
    try {
      const payment = await service.processPayment(req.body);
      res.status(201).json(payment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getByResident(req: Request, res: Response) {
    try {
      const residentId = req.params.residentId;
      if (!residentId) {
        return res.status(400).json({ message: "residentId parameter is required" });
      }
      const payments = await service.getPaymentsByResident(residentId);
      res.status(200).json(payments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const payments = await service.getAllPayments();
      res.status(200).json(payments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  // new: save card endpoint
  static async saveCard(req: Request, res: Response) {
    try {
      // expected body: { residentId, holderName, number, expiry }
      const saved = await cardService.saveCard(req.body);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
