import React from 'react'
import { Link } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'

const Navbar = ({user}) => {
  return (
   <>
   <nav className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Navbar left: Logo or links */}
        <div>
          <Link to="" className="text-gray-700 text-xl font-bold">
           {user?.role} Dashboard
          </Link>
        </div>

        {/* Navbar right: User info and logout */}
        <div className="flex items-center space-x-4">
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
    </nav>
   </>
  )
}

export default Navbar
