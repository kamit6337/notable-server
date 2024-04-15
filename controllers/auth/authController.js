import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import generateWebToken from "../../utils/generateWebToken.js";
import { User } from "../../models/UserModel.js";
import Req from "../../utils/Req.js";
import axios from "axios";
import path from "path";
import fs from "fs";

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
    // images folder inside public already present
    const publicFolderPath = path.join("public", "images", "userProfile");
    const fileName = `image_${Date.now()}.jpeg`;
    const saveFilePath = `images/userProfile/${fileName}`;
    const filePath = path.join(publicFolderPath, fileName);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(publicFolderPath)) {
      fs.mkdirSync(publicFolderPath, { recursive: true });
    }

    const response = await axios.get(picture, { responseType: "arraybuffer" });

    await fs.promises.writeFile(filePath, response.data);

    // MARK: CREATE USER
    const createUser = await User.create({
      name,
      email,
      photo: saveFilePath,
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

  // MARK: IF FIND USER
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
