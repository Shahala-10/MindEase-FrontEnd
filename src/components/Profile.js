import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaVenusMars, FaBirthdayCake, FaPhone, FaSignOutAlt, FaComments } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("🔒 No token found, redirecting to login...");
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching profile:", err);
        setError("Session expired or unauthorized");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="profile-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="profile-card">
        <div className="profile-avatar">
          <FaUser className="avatar-icon" />
        </div>
        <h2 className="profile-title">Your Profile</h2>
        <div className="profile-details">
          <motion.p variants={itemVariants}>
            <FaUser className="detail-icon" />
            <strong>Name:</strong> {user.full_name}
          </motion.p>
          <motion.p variants={itemVariants}>
            <FaEnvelope className="detail-icon" />
            <strong>Email:</strong> {user.email}
          </motion.p>
          <motion.p variants={itemVariants}>
            <FaVenusMars className="detail-icon" />
            <strong>Gender:</strong> {user.gender}
          </motion.p>
          <motion.p variants={itemVariants}>
            <FaBirthdayCake className="detail-icon" />
            <strong>Date of Birth:</strong> {user.date_of_birth}
          </motion.p>
          <motion.p variants={itemVariants}>
            <FaPhone className="detail-icon" />
            <strong>Phone:</strong> {user.phone_number}
          </motion.p>
        </div>
        <div className="button-group">
          <button
            className="go-to-chat-btn"
            onClick={() => navigate("/chat")}
            aria-label="Go to chat"
          >
            <FaComments className="button-icon" />
            Go to Chat
          </button>
          <button
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <FaSignOutAlt className="button-icon" />
            Log Out
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;