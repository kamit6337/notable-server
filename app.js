import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { corsOptions } from "./utils/corsOptions.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import passport from "passport";
import "./utils/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import session from "express-session";
import cookieSession from "cookie-session";
import { expressSessionOptions } from "./utils/expressSessionOptions.js";
import { cookieSessionOptions } from "./utils/cookieSessionOptions.js";
import protectRoute from "./middlewares/protectRoute.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors(corsOptions));

// Middleware to create a time session of cookie (login, jwt)
// app.use(session(expressSessionOptions));
app.use(cookieSession(cookieSessionOptions));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse incoming body
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies (optional)
app.use(express.urlencoded({ extended: true }));

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/user", protectRoute, userRouter);

// NOTE: UNIDENTIFIED ROUTES
app.all("*", (req, res, next) => {
  return next(
    new HandleGlobalError(
      `Somethings went wrong. Please check your Url - ${req.originalUrl}`,
      500,
      "Fail"
    )
  );
});

//  NOTE: GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
