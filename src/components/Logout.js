import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Optional parent callback
      if (onLogout) onLogout();
      
      // Clear login data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // ✅ Navigate to login page without reload
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="nav-link logout-btn text-gray-300 hover:text-red-400 w-full text-left py-2"
    >
      Logout
    </button>
  );
};

export default Logout;
