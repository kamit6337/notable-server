import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import generateWebToken from "../../../utils/generateWebToken.js";
import { environment } from "../../../utils/environment.js";
import { User } from "../../../models/UserModel.js";

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //   MARK: IF USER DOES NOT PROVIDE EITHER EMAIL OR PASSWORD
  if (!email || !password) {
    return next(
      new HandleGlobalError("Email or Password is not provided", 404)
    );
  }

  const findUser = await User.findOne({ email });

  //   MARK: IF USER DOES NOT EXIST WITH THAT PASSWORD THROW ERROR
  if (!findUser) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  //   MARK: CHECK FORGOT PASSWORD EMAIL, NEW PASSWORD
  const userFromSession = req.session?.confirmOTP
    ?.filter((obj) => obj.email === email)
    .at(-1);

  if (userFromSession) {
    const current = Date.now();

    if (current > userFromSession.date) {
      req.session.confirmOTP = req.session.confirmOTP.filter(
        (obj) => obj.email !== email
      );
      return next(new HandleGlobalError("OTP confirm time has passed", 404));
    }

    const checkOTP = password === userFromSession.otp;

    if (!checkOTP) {
      return next(new HandleGlobalError("Email or Password is incorrect", 404));
    }

    req.session.confirmOTP = req.session.confirmOTP.filter(
      (obj) => obj.email !== email
    );
  } else {
    //   MARK: IF USER PASSWORD DOES NOT MATCH WITH HASH PASSWORD, THROW ERROR
    const isPasswordValid = findUser.checkPassword(password); // Boolean

    if (!isPasswordValid) {
      return next(new HandleGlobalError("Email or Password is incorrect", 404));
    }
  }

  //   MARK: UPDATE THE USER PROFILE AFTER SUCCESSFUL LOGIN
  await User.findOneAndUpdate(
    {
      _id: findUser._id,
    },
    {
      $inc: { loginCount: 1 },
      $currentDate: { lastLoginAt: true },
    }
  );

  //   MARK: USER EMAIL AND PASSWORD IS CONFIRMED, SEND TOKEN AND MAKE LOGIN
  const token = generateWebToken({
    id: findUser._id,
    role: findUser.role,
  });

  res.cookie("token", token, {
    expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    message: "Login Successfully",
  });
});

export default login;
