import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import { User } from "../models/UserModel.js";

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
    const updateAllUser = await User.updateMany(
      {},
      {
        $unset: {
          loginCount: "",
          lastLogin: "",
          doubleVerify: "",
        },
      }
    );

    console.log("updateAllUser", updateAllUser);
  } catch (error) {
    console.error("Error occur in update:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect();
  }
});

// Connection closed
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
