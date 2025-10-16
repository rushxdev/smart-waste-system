import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Attempting MongoDB connection with URI:", mongoUri ? mongoUri.substring(0, 20) + "..." : "undefined");
    
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
