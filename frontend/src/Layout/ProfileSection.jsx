import React from 'react';
import { Link } from 'react-router-dom';

const ProfileSection = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>; // Show loading if no user data
  }
// console.log(user);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-64 text-center h-dvh">
      {/* Profile Image */}
      <img
        src={user.profileImage || "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"} // Use user's profile image if available
        alt="User Profile"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      
      {/* User Name and Role */}
      <h3 className="mt-2 text-xl font-bold text-gray-800">{user.fullName}</h3>
      <p className="text-gray-500 mb-4">{user.role}</p>

      {/* Upload Project Button */}

      {user.role === "Student" ? (
        <Link
          to="/submit-project"
          className="block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Upload Your Project
        </Link>
      ) : (
       ""
      )}
    </div>
  );
};

export default ProfileSection;
