import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config({ path: "./config/.env" });

// Create a connection function
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connection();
