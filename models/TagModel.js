import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please provide User ID"],
      select: false,
    },
    title: {
      type: String,
      unique: [true, "Tag Title should be unique"],
      required: [true, "Please provide a Tag Title"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    noteList: {
      type: [String],
      default: [],
    },
  },
  {
    strict: false,
  }
);

export const Tag = mongoose.model("Tag", tagSchema);
