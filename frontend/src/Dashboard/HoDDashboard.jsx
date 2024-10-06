import React, { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import ProfileSection from "../Layout/ProfileSection";
import ProjectList from "../pages/ProjectList";

const HoDDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists and has the right role
    if (!user) {
      navigate("/login"); // Redirect if not logged in
    } else if (user.role !== "HoD") {
      navigate("/login"); // Redirect if the role is not HoD
    } else {
      setLoading(false); // Stop loading if user is valid
    }
  }, [user, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Center loading indicator
  }

  return (
    <>
      <Navbar user={user} />
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="lg:w-1/4 p-4 border-r border-gray-300 lg:h-full">
          <ProfileSection user={user} />
        </div>
        <div className="lg:w-3/4 p-4 overflow-auto lg:h-full">
          <ProjectList user={user} />
        </div>
      </div>
    </>
  );
};

export default HoDDashboard;
