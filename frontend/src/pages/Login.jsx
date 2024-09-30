import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    // Validate input
    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both email/phone and password.");
      setIsLoading(false);
      return;
    }
// console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/logIn",
        { ...formData },
        { withCredentials: true }
      );

      const { accessToken, user } = response.data.data;
      const { role, emailVerified } = user;
    
      // Store access token and user details securely
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccessMessage("User logged in successfully.");

      // console.log("User Role:", role);  // Debug log for role
      // console.log("Email Verified:", emailVerified);

      // Navigate based on email verification and role
      if (!emailVerified) {
        navigate("/generate-otp");
      } else if (role === "Student") {
        navigate("/student-dashboard");
      } else if (role === "ProjectGuide") {
        navigate("/guide-dashboard");
      } else if (role === "HoD") {
        navigate("/hod-dashboard");
      }

    } catch (error) {
      setIsLoading(false);
      if (error.response?.status === 400) {
        setErrorMessage("Incorrect password or user does not exist.");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
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
          <div className="mb-4 text-green-500 text-center">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="emailOrPhone">
              Email or Phone Number
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email or phone number"
              required
              aria-label="Email or phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
              aria-label="Password"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
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
