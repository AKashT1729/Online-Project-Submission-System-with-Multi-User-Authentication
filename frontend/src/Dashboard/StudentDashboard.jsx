import React, { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import ProfileSection from "../Layout/ProfileSection";
import StudentProjectDetails from "../pages/StudentProjectDetails";

const StudentDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists and has the right role
    if (!user) {
      navigate("/login"); // Redirect if not logged in
    } else if (user.role !== "Student") {
      navigate("/login"); // Redirect if the role is not Student
    } else {
      setLoading(false); // Stop loading if user is valid
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    ); // Display a loading spinner while checking user
  }

  return (
    <>
      <Navbar user={user} />
      <div className="flex flex-col md:flex-row h-screen">
        <div className="md:w-1/4 p-4 border-r border-gray-200">
          <ProfileSection user={user} />
        </div>
        <div className="md:w-3/4 p-4 overflow-y-auto">
          <StudentProjectDetails user={user} />
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
