import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // To navigate programmatically
import Loading from "../components/Loading"

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Hook to navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validation Functions
  const validateFullName = (fullName) => {
    return /^[a-zA-Z\s]+$/.test(fullName); // Must be non-empty and only letters
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex pattern
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Password must be at least 6 characters
  };

  const validatePhoneNumber = (phoneNumber) => {
    return /^\d{10,15}$/.test(phoneNumber); // Phone number must be 10-15 digits
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true); // Set loading state to true

    // Validate form data
    if (!validateFullName(formData.fullName)) {
      setErrorMessage("Please enter a valid full name (letters only).");
      setIsLoading(false); // Reset loading state
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false); // Reset loading state
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsLoading(false); // Reset loading state
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setErrorMessage("Phone number must be 10-15 digits long.");
      setIsLoading(false); // Reset loading state
      return;
    }

    if (!formData.role) {
      setErrorMessage("Please select a role.");
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      // Make the API request
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData
      );

      // If successful, show success message
      setSuccessMessage("You registered successfully!");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login"); // Navigate to the login page
      }, 2000);

    } catch (error) {
      // If error occurs, check if user already exists
      if (error.response?.status === 409) {
        setErrorMessage("User already exists. Please log in.");
      } else {
        // Handle other errors
        setErrorMessage(
          error.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false); // Reset loading state after completion
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 text-green-500 text-center">
            {successMessage}
          </div>
        )}

        {isLoading ? ( // Show Loading component while loading
          <Loading />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
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

            <div className="mb-4">
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="Student">Student</option>
                {/* <option value="ProjectGuide">Project Guide</option>
                <option value="HoD">HoD</option> */}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
