import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import generateWebToken from "../../utils/generateWebToken.js";
import { User } from "../../models/UserModel.js";
import Req from "../../utils/Req.js";
import axios from "axios";
import path from "path";
import fs from "fs";

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

  console.log("req.user", req.user);

  const findUser = await User.findOne({ OAuthId: id });

  console.log("findUser", findUser);

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

    console.log("createUser", createUser);

    const token = generateWebToken({
      id: createUser._id,
      role: createUser.role,
    });
    console.log("token", token);

    const tokenExpire = Date.now() + environment.JWT_EXPIRES_IN;
    console.log("tokenExpire", tokenExpire);

    res.cookie("token", token, {
      expires: new Date(tokenExpire),
    });
    console.log("token is send as cookie");

    res.redirect(environment.CLIENT_URL);
    console.log("redirect back to client");

    return;
  }

  // MARK: IF FIND USER
  const token = generateWebToken({
    id: findUser._id,
    role: findUser.role,
  });
  console.log("token", token);

  const tokenExpire = Date.now() + environment.JWT_EXPIRES_IN;
  console.log("tokenExpire", tokenExpire);

  res.cookie("token", token, {
    expires: new Date(tokenExpire),
  });
  console.log("token is send as cookie");

  res.redirect(environment.CLIENT_URL);

  console.log("redirect back to client");

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
