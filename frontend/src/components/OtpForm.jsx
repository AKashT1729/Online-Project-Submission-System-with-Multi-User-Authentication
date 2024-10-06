import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("email"); // Retrieve the email from localStorage

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input automatically
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }

    // Move to the previous input if backspace is pressed
    if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Handle OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join(""); // Get the OTP as a single string

    if (otpString.length !== 6) {
      setErrorMessage("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      // Verify OTP
      await axios.post("http://localhost:8000/api/v1/users/verifyOtp", {
        email,
        otp: otpString,
      });

      setSuccessMessage("OTP verified successfully.");
      navigate("/reset-password"); // Navigate to password reset form if OTP is verified
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    try {
      // Resend OTP
      await axios.post("http://localhost:8000/api/v1/users/forgetPassword", {
        email,
      });
      setSuccessMessage("OTP sent successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        className="w-full max-w-sm bg-white flex flex-col items-center justify-center p-6 gap-5 shadow-lg rounded-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-gray-900">Enter OTP</h2>
        <p className="text-sm text-gray-600 text-center">
          We have sent a verification code to your email
        </p>

        <div className="flex w-full gap-2 justify-center">
          {otp.map((val, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center bg-gray-200 rounded-lg border-none focus:bg-blue-100 outline-none font-bold text-gray-700 transition-colors"
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full h-10 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Verify
        </button>

        <button
          type="button"
          onClick={handleResend}
          className="text-blue-500 font-semibold text-sm mt-2 hover:underline"
        >
          Resend Code
        </button>

        {errorMessage && (
          <div className="mt-2 text-red-500 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mt-2 text-green-500 text-center">{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default OtpForm;
