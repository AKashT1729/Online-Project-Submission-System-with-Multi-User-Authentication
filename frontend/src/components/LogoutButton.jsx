import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.post("http://localhost:8000/api/v1/users/logout", null, {
        withCredentials: true, // Ensures cookies are sent with the request
      },
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
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
