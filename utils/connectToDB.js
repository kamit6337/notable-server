import mongoose from "mongoose";
import { environment } from "./environment.js";

let isDatabaseConnected = false;

const connectToDB = async () => {
  if (isDatabaseConnected) {
    return;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(environment.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isDatabaseConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error(error.message || "Something went wrong");
  }
};

mongoose.connection.on("disconnected", () => {
  isDatabaseConnected = false;
  console.log("Disconnected from MongoDB");
});

export default connectToDB;
