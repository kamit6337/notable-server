import express from "express";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import "./utils/passport.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import protectRoute from "./middlewares/protectRoute.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";

const app = express();

// NOTE: GLOBAL MIDDLEWARES
globalMiddlewares(app);

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
