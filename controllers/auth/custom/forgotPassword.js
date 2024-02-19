import catchAsyncError from "../../../utils/catchAsyncError.js";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { environment } from "../../../utils/environment.js";
import generateString from "../../../utils/javaScript/generateString.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import { User } from "../../../models/UserModel.js";

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: environment.MY_GMAIL_ID,
    pass: environment.MY_GMAIL_PASSWORD,
  },
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new HandleGlobalError("Email is not provided", 404));
  }

  const findUser = await User.findOne({ email });

  if (!findUser) {
    return next(new HandleGlobalError("You are not our customer", 403));
  }

  // Generate OTP (you can replace this with your OTP generation logic)
  const otp = generateString();

  const date = Date.now() + 15 * 60 * 1000; // 15 minutes

  const obj = { email, otp, date };

  if (Array.isArray(req.session?.confirmOTP)) {
    let arr = req.session.confirmOTP;
    arr = arr.filter((obj) => obj.email !== email);
    arr.push(obj);
    req.session.confirmOTP = arr;
  } else {
    // If it's not an array, create a new array with obj
    req.session.confirmOTP = [obj];
  }

  // Render HTML template with dynamic OTP
  const htmlTemplate = await ejs.renderFile(path.join("views", "otp.ejs"), {
    otp,
  });

  // Set up email options
  const mailOptions = {
    from: `Notable ${environment.MY_GMAIL_ID}`,
    to: email,
    subject: "Your OTP for verification",
    html: htmlTemplate,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending email" });
    }
    res.json({ message: "Email sent successfully", info });
  });
});

export default forgotPassword;
