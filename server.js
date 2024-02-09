import { environment } from "./utils/environment.js";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";

const PORT = environment.PORT || 8080;

export let isDatabaseConnected = false;

mongoose.connect(environment.mongoDB_url);

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  isDatabaseConnected = true;
  app.listen(environment.PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  isDatabaseConnected = false;
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  isDatabaseConnected = false;
  console.log("Disconnected from MongoDB");
});
