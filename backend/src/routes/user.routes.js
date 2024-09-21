import { Router } from "express";
import {
  changeCurrentPassword,
  forgetPassword,
  generateEmailOtp,
  logingUser,
  logOutUser,
  registerUser,
  resetPassword,
  verifyEmailOtp,
  verifyOtp,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const routes = Router();

// API endpoints for User management
routes.route("/register").post(registerUser);

routes.route("/logIn").post(logingUser);

routes.route("/logout").post(verifyJWT, logOutUser);

routes.route("/changePassword").post(verifyJWT,changeCurrentPassword)
routes.route("/forgetPassword").post(forgetPassword);
routes.route("/verifyOtp").post(verifyOtp);
routes.route("/resetPassword").post(resetPassword);

routes.route("/generate-otp").post(verifyJWT, generateEmailOtp);
routes.route("/verify-otp").post(verifyJWT, verifyEmailOtp);

export default routes;
