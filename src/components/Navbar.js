import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // ✅ Paths where the navbar should be hidden (Login page removed)
  const hideNavbarOn = ["/signup", "/forgot-password", "/chat"];

  // ✅ If the current path is in the list, don't render the navbar
  if (hideNavbarOn.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      {/* ✅ Logo */}
      <Link to="/" className="text-2xl font-bold flex items-center">
        <span className="text-green-500 mr-2">◆</span> MindEase
      </Link>

      {/* ✅ Navigation Links */}
      <div className="flex items-center space-x-4">
        <Link to="/home" className="hover:text-green-400">
          Home
        </Link>
        <Link to="/features" className="hover:text-green-400">
          Features
        </Link>
        <Link to="/resources" className="hover:text-green-400">
          Resources
        </Link>
        <Link to="/about" className="hover:text-green-400">
          About Us
        </Link>
          <Link to="/contact" className="hover:text-green-400">
          Contact Us
        </Link>
        <Link
          to="/login"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
         Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
