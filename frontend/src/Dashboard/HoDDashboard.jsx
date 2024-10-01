import React, { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import ProfileSection from "../Layout/ProfileSection";

const HoDDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists and has the right role
    if (!user) {
      navigate("/login"); // Redirect if not logged in
    } else if (user.role !== "HoD") {
      navigate("/login"); // Redirect if the role is not ProjectGuide
    } else {
      setLoading(false); // Stop loading if user is valid
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking user
  }

  return (
    <>
      <Navbar user={user} />
      <div className="h-vh">
        <ProfileSection user={user} />
      </div>
      
    </>
  );
};

export default HoDDashboard;
