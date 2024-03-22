import { User } from "../../../models/UserModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { environment } from "../../../utils/environment.js";
import verifyWebToken from "../../../utils/verifyWebToken.js";
import bcrypt from "bcryptjs";

const newPassword = catchAsyncError(async (req, res, next) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const decoded = verifyWebToken(token);

  const currentDate = Date.now();

  if (currentDate > decoded.expire) {
    return next(
      new HandleGlobalError(
        "It's time out. Click again on Forgot Password to send link",
        404
      )
    );
  }

  if (email !== decoded.email) {
    return next(new HandleGlobalError("Issue in create new Password"));
  }

  const hashPassword = bcrypt.hashSync(password, environment.SALT_ROUND);

  await User.findOneAndUpdate(
    {
      _id: decoded.id,
    },
    {
      password: hashPassword,
      updatedAt: Date.now(),
    }
  );

  res.status(200).json({
    message: "Password has been updated",
  });
});

export default newPassword;
