import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control mobile menu visibility

  return (
    <>
      <nav className="bg-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Navbar left: Logo or links */}
          <div>
            <Link to="/" className="text-gray-700 text-xl font-bold">
              {user?.role} Dashboard
            </Link>
          </div>

          {/* Hamburger icon for mobile */}
          <div className="block lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)} // Toggle menu on click
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>

          {/* Navbar right: User info and logout */}
          <div className={`flex items-center space-x-4 lg:flex lg:space-x-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
            {/* Conditionally render username if available */}
            {user && (
              <span className="text-gray-700 font-semibold">
                Welcome, {user.fullName}!
              </span>
            )}

            {/* Logout button */}
            <LogoutButton />
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="flex flex-col mt-2 lg:hidden">
            {/* Add links or other elements here if needed */}
            <Link to="/" className="text-gray-700 px-2 py-1 hover:bg-gray-300 rounded">
              Home
            </Link>
            {/* Add other links as needed */}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
