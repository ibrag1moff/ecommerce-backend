import mongoose from "mongoose";
import dotenv from "dotenv";

// Load enviroment variables
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB connected successfully!");
  } catch (e) {
    console.error("MongoDB connection error: ", e);
    process.exit(1);
  }
};
