import { User } from "../../../models/UserModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import bcrypt from "bcryptjs";
import { environment } from "../../../utils/environment.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const { id, name, password } = req.body;

  if (!id || !name) {
    return next(new HandleGlobalError("Not provided all field", 404));
  }

  const obj = {
    name,
  };

  if (password) {
    const hashPassword = bcrypt.hashSync(password, environment.SALT_ROUND);
    obj.password = hashPassword;
  }

  const updateUser = await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "User profile has been updated",
    data: updateUser,
  });
});

export default updateUserProfile;
