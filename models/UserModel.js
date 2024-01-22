import mongoose from "mongoose";
import { Notebook } from "./NotebookModel.js";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Please Provide ID"],
  },
  name: {
    type: String,
    required: true,
  },
  email_Id: {
    type: String,
    required: [true, "Email need to provide."],
  },
  OAuthProvider: {
    type: String,
    required: [true, "OAUth Provider need to provide."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  loginCount: Number,
  lastLoginAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  await Notebook.create({
    userId: this._id,
    title: "My Notebook",
    primary: true,
  });

  next();
});

export const User = mongoose.model("User", userSchema);
