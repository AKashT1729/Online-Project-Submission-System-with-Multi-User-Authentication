import React from 'react';
import { Link } from 'react-router-dom';

const ProfileSection = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>; // Show loading if no user data
  }

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-64 text-center mx-auto h-auto">
      {/* Profile Image */}
      <img
        src={user.profileImage || "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"} // Use user's profile image if available
        alt="User Profile"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      
      {/* User Name and Role */}
      <h3 className="mt-2 text-lg sm:text-xl font-bold text-gray-800">{user.fullName}</h3>
      <p className="text-sm sm:text-gray-500 mb-4">{user.role}</p>

      {/* Upload Project Button */}
      {user.role === "Student" && (
        <Link
          to="/submit-project"
          className="block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
        >
          Upload Your Project
        </Link>
      )}
    </div>
  );
};

export default ProfileSection;
