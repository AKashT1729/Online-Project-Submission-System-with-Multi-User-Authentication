import { Router } from "express";
import {
  changeCurrentPassword,
  forgetPassword,
  generateEmailOtp,
  logingUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  verifyEmailOtp,
  verifyOtp,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// API endpoints for User management
router.route("/register").post(registerUser);

router.route("/logIn").post(logingUser);

router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyOtp").post(verifyOtp);
router.route("/resetPassword").post(resetPassword);

router.route("/generate-otp").post(verifyJWT, generateEmailOtp);
router.route("/verify-otp").post(verifyJWT, verifyEmailOtp);

export default router;
