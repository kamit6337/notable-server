import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import generateWebToken from "../../utils/generateWebToken.js";
import { User } from "../../models/UserModel.js";
import Req from "../../utils/Req.js";

const PRODUCTION = "production";

// NOTE: LOGIN SUCCESS
export const loginSuccess = catchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(
      new HandleGlobalError("Error in login. Please try again!", 403)
    );

  const {
    id,
    provider,
    _json: { name, email, picture },
  } = req.user;

  const findUser = await User.findOne({ OAuthId: id });

  // MARK: IF NOT FIND USER
  if (!findUser) {
    // MARK: CREATE USER
    const createUser = await User.create({
      name,
      email,
      photo: picture,
      OAuthId: id,
      OAuthProvider: provider,
    });

    if (!createUser) {
      return next(new HandleGlobalError("Issue in Signup", 404));
    }

    const token = generateWebToken({
      id: createUser._id,
      role: createUser.role,
    });

    const cookieOptions = {
      maxAge: environment.JWT_EXPIRES_IN,
      httpOnly: true,
    };

    if (environment.NODE_ENV === PRODUCTION) {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
    }

    res.cookie("token", token, cookieOptions);
    res.redirect(environment.CLIENT_URL);
    return;
  }

  // MARK: IF FIND USER IS PRESENT

  // MARK: CHECK WHETHER PHOTO IS UPDATED OR NOT
  const checkPath = "images/userProfile/";

  if (findUser.photo.startsWith(checkPath)) {
    await User.findOneAndUpdate(
      {
        _id: String(findUser._id),
      },
      {
        photo: picture,
      }
    );
  }

  // MARK: CREATE TOEKN AND SEND IT
  const token = generateWebToken({
    id: findUser._id,
    role: findUser.role,
  });

  const cookieOptions = {
    maxAge: environment.JWT_EXPIRES_IN,
    httpOnly: true,
  };

  if (environment.NODE_ENV === PRODUCTION) {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "None";
  }

  res.cookie("token", token, cookieOptions);

  res.redirect(environment.CLIENT_URL);

  return;
});

// NOTE: LOGOUT
export const logout = (req, res) => {
  const cookies = Req(req);

  Object.keys(cookies).forEach((cookie) => {
    res.clearCookie(cookie);
  });

  res.status(200).json({
    message: "Successfully Logout",
  });
};
