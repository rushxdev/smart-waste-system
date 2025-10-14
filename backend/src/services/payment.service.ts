import type { IPayment } from "../models/payment.model";
import { PaymentRepository } from "../repositories/payment.repository";

export class PaymentService {
  private repo: PaymentRepository;

  constructor(repo: PaymentRepository) {
    this.repo = repo;
  }

  async processPayment(data: Partial<IPayment>): Promise<IPayment> {
    if (!data.residentId || !data.amount || !data.method) {
      throw new Error("Missing payment details");
    }

    data.status = "Completed";
    data.transactionId = "TXN-" + Math.random().toString(36).substring(2, 10);

    return await this.repo.create(data);
  }

  async getPaymentsByResident(residentId: string): Promise<IPayment[]> {
    return await this.repo.findByResident(residentId);
  }

  async getAllPayments(): Promise<IPayment[]> {
    return await this.repo.findAll();
  }
}
