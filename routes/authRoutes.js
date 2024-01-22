import { environment } from "../utils/environment.js";
import express from "express";
import passport from "passport";
import {
  loginSuccess,
  logout,
  updateUser,
  loginCheck,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login/success", loginSuccess);
router.get("/login/check", loginCheck);

router.get("/updateUser", updateUser);

router.get("/logout", logout);

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
  passport.authenticate("facebook", { scope: ["profile"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: environment.CLIENT_CHECKLOGIN_URL,
    failureRedirect: environment.CLIENT_CHECKLOGIN_URL,
  })
);

export default router;
