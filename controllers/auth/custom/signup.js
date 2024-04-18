import { User } from "../../../models/UserModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { environment } from "../../../utils/environment.js";
import generateWebToken from "../../../utils/generateWebToken.js";

// MARK: PLACED A DUMMY URL IN CASE USER DOES NOT PROVIDE PHOTO
const userPic = `images/userProfile/dummy_profile.png`;

const PRODUCTION = "production";

const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new HandleGlobalError("Not provided all field", 404));
  }

  // MARK: CHECK USER IS ALREADY PRESENT OR NOT

  const findUser = await User.findOne({
    email,
  });

  if (findUser) {
    return next(
      new HandleGlobalError(
        "You have already signed up with this Email ID. Please login or signup with different Email ID"
      )
    );
  }

  // MARK: CREATE USER
  const createUser = await User.create({
    name,
    email,
    password,
    photo: userPic,
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

  res.status(200).json({
    message: "SignUp Successfully",
  });
});

export default signup;
