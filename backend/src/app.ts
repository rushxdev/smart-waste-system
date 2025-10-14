import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import wasteRequestRoutes from "./routes/wasteRequest.routes";
import paymentRoutes from "./routes/payment.routes";
import wasteTrackingRoutes from "./routes/wasteTracking.routes";
import analyticsRoutes from "./routes/analytics.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes placeholder
app.get("/", (req, res) => {
  res.send("Smart Waste Management API running...");
});

app.use("/api/waste-requests", wasteRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/waste-tracking", wasteTrackingRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;