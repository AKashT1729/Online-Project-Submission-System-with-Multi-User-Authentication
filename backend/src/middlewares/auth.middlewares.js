import mongoose from "mongoose";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    
    if (!token) {
      throw new ApiError(401, "Unanthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decodedToken.id);
    
    
    
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    // console.log(user);
    
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invaild access token");
  }
});
