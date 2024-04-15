import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import verifyWebToken from "../../../utils/verifyWebToken.js";
import Req from "../../../utils/Req.js";
import { User } from "../../../models/UserModel.js";
import getCurrentTime from "../../../utils/javaScript/getCurrentTime.js";

const loginCheck = catchAsyncError(async (req, res, next) => {
  const { token } = Req(req);

  const decoded = verifyWebToken(token);

  const currentMilli = getCurrentTime();

  const expireTokenMin = 30 * 60 * 1000; //30 minutes
  const diffeInMilli = decoded.expire - currentMilli;

  if (diffeInMilli < expireTokenMin) {
    return next(
      new HandleGlobalError(
        "Your Session has expired. Please Login Again.",
        400
      )
    );
  }

  const findUser = await User.findOne({
    _id: decoded.id,
  });

  if (!findUser) {
    return next(
      new HandleGlobalError("Unauthorised Access. Please Login Again.", 400)
    );
  }

  // MARK: CHECK UPDATEDAT WHEN PASSWORD UPDATE, SO LOGIN AGAIN IF PASSWORD RESET
  const updatedAtInMilli = new Date(findUser.updatedAt).getTime();

  if (decoded.iat * 1000 <= updatedAtInMilli) {
    return next(new HandleGlobalError("Please login again...", 403));
  }

  res.status(200).json({
    message: "User is present",
    _id: findUser._id,
    name: findUser.name,
    photo: findUser.photo,
    email: findUser.email,
    role: findUser.role,
  });
});

export default loginCheck;
