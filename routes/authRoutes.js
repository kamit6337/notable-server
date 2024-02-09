import { environment } from "../utils/environment.js";
import express from "express";
import passport from "passport";
import {
  loginSuccess,
  logout,
  updateUser,
} from "../controllers/auth/authController.js";
import signup from "../controllers/auth/custom/signup.js";
import loginCheck from "../controllers/auth/custom/loginCheck.js";
import login from "../controllers/auth/custom/login.js";
import forgotPassword from "../controllers/auth/custom/forgotPassword.js";

const router = express.Router();

// NOTE: FORGOT PASSWORD
router.post("/forgot", forgotPassword);

// NOTE: CONTINUOUS CHECK LOGIN
router.get("/login/check", loginCheck);

// NOTE: CUSTOM SIGNUP AND LOGIN
router.post("/signup", signup);
router.post("/login", login);

// NOTE: OAUTH SIGNUP AND LOGIN
router.get("/login/OAuth", loginSuccess);

// NOTE: LOGOUT AND UPDATE USER
router.get("/logout", logout);
router.get("/updateUser", updateUser);

// NOTE: GOOGLE OAUTH
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/updateUser",
    failureRedirect: environment.CLIENT_CHECKLOGIN_URL,
  })
);

// NOTE: FACEBOOK OAUTH
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/updateUser",
    failureRedirect: environment.CLIENT_CHECKLOGIN_URL,
  })
);

export default router;
