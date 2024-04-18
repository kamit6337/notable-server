import mongoose from "mongoose";
import { environment } from "../utils/environment.js";

// Connect to MongoDB
mongoose.connect(environment.mongoDB_url, {});

// Connection error handling
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Connection successful
mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");

  try {
    // Drop the unique index on the 'title' field
    await mongoose.connection.collection("tags").dropIndex({ title: 1 });

    console.log("Unique constraint removed successfully.");
  } catch (error) {
    console.error("Error removing unique constraint:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect();
  }
});

// Connection closed
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
