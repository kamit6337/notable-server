import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID must be provided"],
      select: false,
    },
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: [true, "Please provide a Notebook Id"],
    },
    title: {
      type: String,
      default: "Untitled",
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    shortcut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model("Note", noteSchema);
