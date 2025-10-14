import Payment, { type IPayment } from "../models/payment.model";

export class PaymentRepository {
  async create(paymentData: Partial<IPayment>): Promise<IPayment> {
    const payment = new Payment(paymentData);
    return await payment.save();
  }

  async findByResident(residentId: string): Promise<IPayment[]> {
    return await Payment.find({ residentId });
  }

  async findAll(): Promise<IPayment[]> {
    return await Payment.find();
  }
}
