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
    const updateAllUser = await User.find({
      OAuthId: null,
    });

    const updateEachUser = await Promise.all(
      updateAllUser.map(async (user) => {
        const { _id, name, photo } = user;

        const searchedStr = `https://ui-avatars.com/api`;

        if (photo.startsWith(searchedStr)) return;

        const profilePicUrl = `https://ui-avatars.com/api/?background=random&name=${name}&size=128&bold=true`;

        const updateUser = await User.findOneAndUpdate(
          {
            _id: String(_id),
          },
          {
            photo: profilePicUrl,
          },
          {
            new: true,
          }
        );

        return updateUser;
      })
    );

    console.log("updateAllUser", updateAllUser);
    console.log("updateEachUser", updateEachUser);
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
