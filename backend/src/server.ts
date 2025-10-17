import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables FIRST, before any other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "..", ".env");

console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

// Debug: Check if environment variables are loaded
console.log("Environment variables loaded:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✓ Set" : "✗ Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ Set" : "✗ Not set");
console.log("PORT:", process.env.PORT);

import app from "./app";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to database after env vars are loaded
await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
