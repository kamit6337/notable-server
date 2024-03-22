import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import { User } from "../models/UserModel.js";
import verifyWebToken from "../utils/verifyWebToken.js";
import Req from "../utils/Req.js";

const protectRoute = catchAsyncError(async (req, res, next) => {
  const { token } = Req(req);

  if (!token) {
    return next(new HandleGlobalError("UnAuthorized Access", 403, "Failed"));
  }

  const decoded = verifyWebToken(token);

  const findUser = await User.findById(decoded.id);

  if (!findUser) {
    return next(
      new HandleGlobalError(
        "UnAuthorized Access. You are not our User",
        403,
        "Failed"
      )
    );
  }

  req.userId = String(findUser._id);
  req.user = findUser;

  next();
});

export default protectRoute;
