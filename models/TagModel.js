import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID must be provided"],
      select: false,
    },
    title: {
      type: String,
      required: [true, "Please provide a Tag Title"],
    },
  },
  {
    timestamps: true,
  }
);

export const Tag = mongoose.model("Tag", tagSchema);
