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

  console.log("finduser", findUser);

  //   MARK: IF USER DOES NOT EXIST WITH THAT PASSWORD THROW ERROR
  if (!findUser) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  //   MARK: IF USER PASSWORD DOES NOT MATCH WITH HASH PASSWORD, THROW ERROR
  const isPasswordValid = findUser.checkPassword(password); // Boolean

  console.log("isPasswordValid", isPasswordValid);

  if (!isPasswordValid) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  //   MARK: USER EMAIL AND PASSWORD IS CONFIRMED, SEND TOKEN AND MAKE LOGIN
  const token = generateWebToken({
    id: findUser._id,
    role: findUser.role,
  });

  console.log("token", token);

  res.cookie("token", token, {
    maxAge: environment.JWT_EXPIRES_IN,
    httpOnly: true,
    path: "/", // Allow cookie access from all paths
    domain: ".notable-client.onrender.com",
    secure: true,
  });

  console.log("token is send as cookie");

  res.status(200).json({
    message: "Login Successfully",
  });
  console.log("redirect back to client");
});

export default login;
