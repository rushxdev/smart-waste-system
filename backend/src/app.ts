import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import wasteRequestRoutes from "./routes/wasteRequest.routes";
import paymentRoutes from "./routes/payment.routes";
import wasteTrackingRoutes from "./routes/wasteTracking.routes";
import analyticsRoutes from "./routes/analytics.routes";
import authRoutes from "./routes/auth.routes.js"; 
import scheduleRoutes from "./routes/schedule.routes";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(cors());
app.use(express.json());

// Note: connectDB() is now called in server.ts after env vars are loaded

// Routes placeholder
app.get("/", (req, res) => {
  res.send("Smart Waste Management API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/waste-requests", wasteRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/waste-tracking", wasteTrackingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/users", userRoutes);

export default app;