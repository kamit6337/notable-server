import mongoose from "mongoose";
import validation from "validator";
import bcrypt from "bcryptjs";
import { environment } from "../utils/environment.js";
import { Notebook } from "../models/NotebookModel.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validation.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      default: null,
      select: false,
    },
    photo: {
      type: String,
      required: [true, "Please provide pic"],
    },
    OAuthId: {
      type: String,
      default: null,
      select: false,
    },
    OAuthProvider: {
      type: String,
      default: null,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.checkPassword = function (given_password) {
  //   WORK: CHECK IF USER PASSWORD DOES NOT MATCH WITH HASH PASSWORD
  const checkPassword = bcrypt.compareSync(
    String(given_password),
    this.password
  ); // Boolean

  return checkPassword;
};

userSchema.pre("save", function (next) {
  // Check if there's a password to hash
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, environment.SALT_ROUND);
  }

  next();
});

userSchema.pre("save", async function (next) {
  await Notebook.create({
    user: this._id,
    title: "My Notebook",
    primary: true,
  });

  next();
});

export const User = mongoose.model("User", userSchema);
