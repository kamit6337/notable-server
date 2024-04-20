import { User } from "../../../models/UserModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { environment } from "../../../utils/environment.js";
import generateWebToken from "../../../utils/generateWebToken.js";

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

  const profilePicUrl = `https://ui-avatars.com/api/?background=random&name=${name}&size=128&bold=true`;

  // MARK: CREATE USER
  const createUser = await User.create({
    name,
    email,
    password,
    photo: profilePicUrl,
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
