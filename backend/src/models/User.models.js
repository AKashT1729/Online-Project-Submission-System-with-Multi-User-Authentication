import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Student", "ProjectGuide", "HoD"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

// Encrypting the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password only if it's not already hashed
  const isAlreadyHashed = this.password.startsWith("$2b$");
  if (!isAlreadyHashed) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
// checking password is validity or not
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      phoneNumber: this.phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
