import { Notebook } from "../models/NotebookModel.js";
import { User } from "../models/UserModel.js";
import HandleGlobalError from "../utils/HandleGlobalError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import jwt from "jsonwebtoken";
import { environment } from "../utils/environment.js";

const generateWebToken = (id) => {
  return jwt.sign({ id }, environment.JWT_SECRET_KEY, {
    expiresIn: environment.JWT_EXPIRES_IN,
  });
};

// NOTE: CHECK LOGIN CONTINUOUSLY
export const loginCheck = catchAsyncError(async (req, res, next) => {
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

  // WORK: IF FIND USER
  res.status(200).json({
    auth: true,
  });
  return;
});

// NOTE: UPDATE USER
export const updateUser = catchAsyncError(async (req, res) => {
  if (req.user) {
    const { id } = req.user;

    await User.findOneAndUpdate(
      { id },
      {
        $inc: { loginCount: 1 },
        $currentDate: { lastLoginAt: true },
      }
    );
  }

  res.redirect(environment.CLIENT_CHECKLOGIN_URL);
});

// NOTE: LOGIN SUCCESS
export const loginSuccess = catchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(new HandleGlobalError("You are not logged in.", 403));

  const {
    id,
    provider,
    _json: { name, email, picture },
  } = req.user;

  const findUser = await User.findOne({ id });

  // WORK: IF NOT FIND USER
  if (!findUser) {
    const createUser = await User.create({
      id,
      name,
      email_Id: email,
      OAuthProvider: provider,
      loginCount: 1,
    });

    if (!createUser) {
      return next(new HandleGlobalError("Error in Sign Up", 401, "Error"));
    }

    const token = generateWebToken(createUser._id);

    res.cookie("token", token, {
      expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
      httpOnly: true,
    });

    res.status(200).json({
      auth: true,
      name,
      photo: picture,
      email,
    });
    return;
  }

  // WORK: IF FIND USER
  const token = generateWebToken(findUser._id);

  res.cookie("token", token, {
    expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
    httpOnly: true,
  });

  res.status(200).json({
    auth: true,
    name,
    photo: picture,
    email,
  });
  return;
});

// NOTE: LOGOUT
export const logout = (req, res) => {
  req.logout();

  const cookies = req.cookies;

  Object.keys(cookies).forEach((cookie) => {
    res.clearCookie(cookie);
  });

  res.status(200).json({
    message: "Successfully Logout",
  });
};
