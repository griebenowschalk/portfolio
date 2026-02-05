import mongoose from "mongoose";
import { env } from "./env";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    };

    await mongoose.connect(env.MONGODB_URI, options);

    logger.info("MongoDB connected successfully");
    logger.info(`Database: ${mongoose.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
