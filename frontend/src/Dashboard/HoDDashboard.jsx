import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const HoDDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Check if the user's role is not "HoD"
      if (parsedUser.role !== "HoD") {
        navigate("/login"); // Redirect if not HoD
      }
    } else {
      // If no user is stored, redirect to login
      navigate("/login");
    }

    setLoading(false); // Stop loading after user check
  }, [navigate]);

  if (loading) {
    return <div>Loading HoD Dashboard...</div>; // Display a better loading message
  }

  if (!user) {
    return <div>Redirecting to login...</div>; // Handle case where user is not found
  }

  return (
    <>
      <div>
        <h1>HoD Dashboard</h1>
        <p>Welcome, {user.fullName}!</p>
        {/* Render HoD-specific content here */}
        <LogoutButton />
      </div>
    </>
  );
};

export default HoDDashboard;
