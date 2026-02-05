import mongoose from "mongoose";
import { config } from "./index.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ [Database] Connected to MongoDB");
  } catch (error) {
    console.error("❌ [Database] Connection failed:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ [Database] Disconnected from MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ [Database] Error:", err);
});
