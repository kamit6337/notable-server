import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID must be provided"],
      select: false,
    },
    title: {
      type: String,
      required: [true, "Please provide a Title to your Notebook"],
    },
    primary: {
      type: Boolean,
      default: false,
    },
    shortcut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notebook = mongoose.model("Notebook", notebookSchema);
