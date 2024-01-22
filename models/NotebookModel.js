import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const notebookSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "UserID must be provided"],
      select: false,
    },
    stackId: {
      type: String,
      default: null,
    },
    stackTitle: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: [true, "Please provide a Title to your Notebook"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
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
    strict: false,
  }
);

// Middleware to generate stackId if stackTitle is provided during findOneAndUpdate
notebookSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.stackTitle) {
    // Generate a unique ID for stackId (you can use a library like uuid)
    // For simplicity, I'm using a basic implementation here
    update.$set.stackId = uuidv4();
  }

  next();
});

export const Notebook = mongoose.model("Notebook", notebookSchema);
