import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please provide a User ID"],
      select: false,
    },
    notebookId: {
      type: String,
      required: [true, "Please provide a Notebook Id"],
    },
    notebookTitle: {
      type: String,
      required: [true, "Please provide a Notebook Title"],
    },
    title: {
      type: String,
      default: "Untitled",
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    shortcut: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: false,
  }
);

export const Note = mongoose.model("Note", noteSchema);
