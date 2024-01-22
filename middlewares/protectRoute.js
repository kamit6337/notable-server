import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import jwt from "jsonwebtoken";
import { environment } from "../utils/environment.js";
import { User } from "../models/UserModel.js";

const protectRoute = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new HandleGlobalError("UnAuthorized Access", 403, "Failed"));
  }

  const decodedId = jwt.verify(token, environment.JWT_SECRET_KEY);

  const findUser = await User.findById(decodedId.id);

  if (!findUser) {
    return next(
      new HandleGlobalError(
        "UnAuthorized Access. You are not our User",
        403,
        "Failed"
      )
    );
  }

  req.userId = decodedId.id;

  next();
});

export default protectRoute;
