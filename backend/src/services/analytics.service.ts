import WasteRequest from "../models/wasteRequest.model";
import Payment from "../models/payment.model";
import Tracking from "../models/wasteTracking.model";

export class AnalyticsService {
  async getDashboardSummary() {
    const totalPickups = await WasteRequest.countDocuments();
    const completedPickups = await Tracking.countDocuments({ status: "Collected" });

    const payments = await Payment.find();
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

    const topWasteTypes = await WasteRequest.aggregate([
      { $group: { _id: "$wasteType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return {
      totalPickups,
      completedPickups,
      totalPayments,
      topWasteTypes
    };
  }
}
