import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

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

export default app;