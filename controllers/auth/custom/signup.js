import { User } from "../../../models/UserModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { environment } from "../../../utils/environment.js";
import generateWebToken from "../../../utils/generateWebToken.js";

// MARK: PLACED A DUMMY URL IN CASE USER DOES NOT PROVIDE PHOTO
const userPic = `images/userProfile/dummy_profile.png`;

const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new HandleGlobalError("Not provided all field", 404));
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

  console.log("token generated", token);
  console.log("environment.JWT_EXPIRES_IN", environment.JWT_EXPIRES_IN);

  res.cookie("token", token, {
    expires: new Date(Date.now() + environment.JWT_EXPIRES_IN),
    secure: true,
    domain: environment.CLIENT_URL,
  });

  res.status(200).json({
    message: "SignUp Successfully",
  });
});

export default signup;
