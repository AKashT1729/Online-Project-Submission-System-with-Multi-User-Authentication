import crypto from "crypto"
// Function to generate a random OTP of a given length
export const generateOTP = (length = 6) => {
    // Generate a random number based on the length provided
    const otp = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length));
    return otp;
  };