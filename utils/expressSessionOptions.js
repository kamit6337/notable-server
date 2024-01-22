import { environment } from "./environment.js";
import connectMongo from "connect-mongo"; // Import connect-mongo
import session from "express-session";
import mongoose from "mongoose";

// Create a new session store instance
// const MongoStore = connectMongo(session);

export const expressSessionOptions = {
  name: "session",
  secret: environment.JWT_SECRET_KEY, // Replace with your secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: Number(environment.JWT_EXPIRES_IN),
  },
  // store: new MongoStore({
  //   mongooseConnection: mongoose.connection,
  //   collection: "sessions", // Optional: Set the name of the sessions collection
  //   // Additional options for the MongoStore can be added here
  // }),
};
