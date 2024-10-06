import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      // Call the backend logout endpoint
      await axios.post(
        "https://online-project-submission-system-with.onrender.com/api/v1/users/logout",
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear access token from localStorage if it's stored there
      localStorage.removeItem("accessToken");
      localStorage.clear();
      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error?.response?.data?.message || error.message);
    }
  };
  
  return (
    <div className="flex justify-center">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 w-full max-w-xs"
      >
        Log Out
      </button>
    </div>
  );
};

export default LogoutButton;
