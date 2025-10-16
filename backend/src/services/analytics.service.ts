import WasteRequest from "../models/wasteRequest.model";
import Payment from "../models/payment.model";
import Tracking from "../models/wasteTracking.model";

export class AnalyticsService {
  async getDashboardSummary() {
    // Total number of pickup requests
    const totalRequests = await WasteRequest.countDocuments();

    // Count of completed (collected) requests
    const completedRequests = await Tracking.countDocuments({ status: "Collected" });

    // Total waste collected (sum of weights for collected requests)
    const collectedRequests = await Tracking.find({ status: "Collected" })
      .populate("wasteRequestId", "weight")
      .exec();

    const totalWasteCollected = collectedRequests.reduce((sum, t: any) => {
      const weight = t.wasteRequestId?.weight || 0;
      return sum + weight;
    }, 0);

    // All payment records
    const payments = await Payment.find();
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Top waste types (for potential chart use)
    const topWasteTypes = await WasteRequest.aggregate([
      { $group: { _id: "$wasteType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Monthly breakdown (last 6 months)
    const monthlyData = await Payment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          payments: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthlyWaste = await Tracking.aggregate([
      {
        $match: { status: "Collected" },
      },
      {
        $lookup: {
          from: "wasterequests",
          localField: "wasteRequestId",
          foreignField: "_id",
          as: "request",
        },
      },
      { $unwind: "$request" },
      {
        $group: {
          _id: { $month: "$createdAt" },
          waste: { $sum: "$request.weight" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Merge monthly data (convert to frontend-ready format)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyDataMerged = months.map((m, index) => {
      const monthWaste = monthlyWaste.find((mw) => mw._id === index + 1)?.waste || 0;
      const monthPayments = monthlyData.find((mp) => mp._id === index + 1)?.payments || 0;
      return { month: m, waste: monthWaste, payments: monthPayments };
    });

    return {
      totalWasteCollected,
      totalRequests,
      totalPayments,
      completedRequests,
      topWasteTypes,
      monthlyData: monthlyDataMerged,
    };
  }
}

