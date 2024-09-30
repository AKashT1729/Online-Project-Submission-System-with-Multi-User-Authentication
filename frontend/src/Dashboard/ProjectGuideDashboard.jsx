import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";

function ProjectGuideDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Check if the user is not a ProjectGuide, redirect to login
      if (parsedUser.role !== "ProjectGuide") {
        navigate("/login"); // Redirect if not ProjectGuide
      }
    } else {
      // If no user is stored, redirect to login
      navigate("/login");
    }

    setLoading(false); // Stop loading after checking
  }, [navigate]);

  if (loading) {
    return <div>Loading dashboard...</div>; // Improved loading experience
  }

  if (!user) {
    return <div>Redirecting to login...</div>; // If user data is not available
  }

  return (
    <div>
      <h1>Welcome to the {user.role} Dashboard!</h1>
      <p>Welcome, {user.fullName}!</p>
      <LogoutButton />
    </div>
  );
}

export default ProjectGuideDashboard;
