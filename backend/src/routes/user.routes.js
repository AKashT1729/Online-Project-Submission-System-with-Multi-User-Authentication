import { Router } from "express";
import { forgetPassword, logingUser, logOutUser, registerUser, resetPassword, verifyOtp } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const routes = Router();

// API endpoints for User management
routes.route('/register').post(registerUser)

routes.route('/logIn').post(logingUser);

routes.route('/logout').post(verifyJWT,logOutUser)

routes.route('/forgetPassword').post(forgetPassword)
routes.route('/verifyOtp').post( verifyOtp)
routes.route('/resetPassword').post( resetPassword)

export default routes