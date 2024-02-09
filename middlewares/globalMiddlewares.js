import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import { corsOptions } from "../utils/corsOptions.js";
import session from "express-session";
import expressSessionOptions from "../utils/expressSessionOptions.js";
import checkDatabaseConnection from "./checkDatabaseConnection.js";
// import compression from "compression";

const globalMiddlewares = (app) => {
  app.use(checkDatabaseConnection);

  // The middleware will attempt to compress response bodies for all request that traverse through the middleware
  //   app.use(compression());

  app.use(cors(corsOptions));

  // app.set("view engine", "ejs");
  // Serve static files from the public folder
  //   app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static("public"));

  // Middleware to create a time session of cookie (login, jwt)
  // app.use(session(expressSessionOptions));
  // app.use(cookieSession(cookieSessionOptions));

  app.use(session(expressSessionOptions));

  // Middleware to parse cookies
  // app.use(cookieParser());

  // Middleware to parse incoming body
  app.use(bodyParser.json());

  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Middleware to parse URL-encoded request bodies (optional)
  app.use(express.urlencoded({ extended: true }));

  return app;
};

export default globalMiddlewares;
