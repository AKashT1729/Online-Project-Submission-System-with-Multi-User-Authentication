import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import crypto from "crypto"; // For hashing OTPs securely
import bcrypt from "bcrypt";
const otpStore = {};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log(accessToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating while generating refresh tokens and access tokens"
    );
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - check field is not empty
  //check if user already exists : email
  //create user object - create entry in database
  //remove password and refresh token field from response
  //check for user creation
  //retun response

  const { fullName, email, password, role, phoneNumber } = req.body;

  //   console.log(req.body)
  if (
    [fullName, email, password, role, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }
  //check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    phoneNumber,
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw ApiError(500, "User not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "user registered successfully"));
});

// LogIn User
const logingUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  // Validate email or phone number input
  if (!(email || phoneNumber)) {
    throw new ApiError(400, "Email or phoneNumber is required");
  }

  // Find the user by email or phone number
  const user = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // Compare the plain password from the request with the hashed password stored in the database
  const isPasswordValid = await user.isPasswordCorrect(password);

  // console.log("Entered Password:", password);
  // console.log("Stored Password (Hashed):", user.password);
  // console.log("Password Valid:", isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(400, "Password is not correct");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  // Select user details without password and refreshToken for response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Return success response with tokens and user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//LogOut User
const logOutUser = asyncHandler(async (req, res) => {
  // console.log(req.user)
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  const optons = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", optons)
    .clearCookie("refreshToken", optons)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

//for frontend users only use this method to refresh the  access token if  access token is expired
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "unauthorized request");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired ");
    }
    const optons = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", user.accessToken, optons)
      .cookie("refreshToken", user.newRefreshToken, optons)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "refresh token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const forgetPassword = asyncHandler(async (req, res) => {
  // Step 1: Get email from frontend
  const { email } = req.body;

  // Step 2: Check if user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Step 3: Generate OTP
  const otp = generateOTP(6);

  // Optionally: You can hash the OTP before saving it for security
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  // Step 4: Store OTP securely in a temporary store (for production, use Redis or database)
  // Expire OTP after 10 minutes (600000 milliseconds)
  otpStore[email] = { otp: hashedOtp, expiresAt: Date.now() + 600000 };

  // Step 5: Send OTP to user's email
  await sendOtpEmail(email, otp);

  // Step 6: Return response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent to your email"));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Step 1: Check if OTP exists for this email
  const storedOtp = otpStore[email];
  if (!storedOtp || storedOtp.expiresAt < Date.now()) {
    throw new ApiError(400, "OTP has expired or is invalid");
  }

  // Step 2: Convert OTP to string before hashing for comparison
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  if (hashedOtp !== storedOtp.otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid, proceed with password reset
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  user.forgetPasswordVerified = true;
  await user.save();
  // Clear the OTP from the store (optional)
  delete otpStore[email];

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.forgetPasswordVerified) {
    throw new ApiError(404, "Not authenticated");
  }

  if (!newPassword || newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  user.password = hashedPassword;
  user.forgetPasswordVerified = false; // Reset the flag to false after successful password reset
  // Save without triggering hooks
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

// Generate OTP for Email Verification after login
const generateEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if the user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.emailVerified) {
    throw new ApiError(400, "Email already verified");
  }
  // Generate a 6-digit OTP
  const otp = generateOTP(6);

  // Hash the OTP for security
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  // Store the hashed OTP with an expiration time (e.g., 10 minutes)
  otpStore[email] = { otp: hashedOtp, expiresAt: Date.now() + 600000 }; // 600000 ms = 10 minutes

  // Send the OTP to the user's email
  await sendOtpEmail(email, otp);

  return res.status(200).json({
    success: true,
    message: `OTP sent to ${email}. Please check your inbox to verify your email.`,
  });
});

// Verify OTP for Email Verification after login
const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Check if an OTP exists for the email and hasn't expired
  const storedOtp = otpStore[email];
  if (!storedOtp || storedOtp.expiresAt < Date.now()) {
    throw new ApiError(400, "OTP has expired or is invalid");
  }

  // Hash the OTP provided by the user
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  // Compare the hashed OTP with the stored one
  if (hashedOtp !== storedOtp.otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid, mark email as verified
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.emailVerified = true; // Assuming there's an `emailVerified` field in the User schema
  await user.save();

  // Optionally clear the OTP from the store after verification
  delete otpStore[email];

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});
export {
  registerUser,
  logingUser,
  logOutUser,
  forgetPassword,
  verifyOtp,
  resetPassword,
  refreshAccessToken,
  changeCurrentPassword,
  generateEmailOtp,
  verifyEmailOtp,
};
