import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/logIn",
        formData,{
          withCredentials: true, // Make sure cookies are set
        }
      );
       // Store access token in localStorage or cookies
       const { accessToken } = response.data.data;
      //  console.log(accessToken);
       
       localStorage.setItem("accessToken", accessToken);

      setSuccessMessage("User logged in successfully");

      const user = response.data.data.user || response.data.data; // Handle response structure
      const userRole = user.role;
      const isEmailVerified = user.emailVerified;

      localStorage.setItem("role", userRole);
      // Check if the email is verified
      if (!isEmailVerified) {
        // Store user details in local storage (or context) for OTP verification
        localStorage.setItem("email", user.email);
        navigate("/generate-otp"); // Redirect to EmailVerification page
      } else {
        // Redirect to the appropriate dashboard based on role
        if (userRole === "Student") {
          navigate("/student-dashboard");
        } else if (userRole === "ProjectGuide") {
          navigate("/guide-dashboard");
        } else if (userRole === "HoD") {
          navigate("/hod-dashboard");
        }
      }
    } catch (error) {
      // Show appropriate error messages
      if (error.response?.status === 400) {
        setErrorMessage("Incorrect password or user does not exist.");
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 text-green-500 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email or Phone Number</label>
            <input
              type="text"
              name="email"
              value={formData.email || formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email or phone number"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            New here?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
          <p className="text-gray-600 mt-2">
            Forgot your password?{" "}
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
