import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFilter, FaRedo, FaExternalLinkAlt, FaArrowLeft, FaSadTear, FaSmile, FaAngry, FaTired, FaBolt, FaMeh, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./SelfHelp.css";

const SelfHelp = () => {
  const [mood, setMood] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [showTooltip, setShowTooltip] = useState(null);
  const navigate = useNavigate();

  const moodOptions = [
    { label: "Happy 😊", icon: <FaSmile /> },
    { label: "Sad 😔", icon: <FaSadTear /> },
    { label: "Angry 😡", icon: <FaAngry /> },
    { label: "Stressed 😟", icon: <FaExclamationTriangle /> },
    { label: "Tired 😴", icon: <FaTired /> },
    { label: "Excited 🎉", icon: <FaBolt /> },
    { label: "Neutral 🙂", icon: <FaMeh /> },
  ];

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/get_user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        setUserName(response.data.data.full_name);
      }
    } catch (err) {
      console.error("Error fetching user name:", err);
    }
  };

  const fetchSelfHelpResources = async (moodLabel = null) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to access self-help resources.");
        setLoading(false);
        return;
      }

      const url = moodLabel
        ? `http://localhost:5000/get_self_help?mood_label=${encodeURIComponent(moodLabel)}`
        : "http://localhost:5000/get_self_help";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        setMood(response.data.data.mood);
        setResources(response.data.data.resources);
      } else {
        setError("Failed to fetch self-help resources.");
      }
    } catch (err) {
      console.error("Error fetching self-help resources:", err);
      setError("An error occurred while fetching resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchSelfHelpResources();
  }, []);

  const handleMoodChange = (e) => {
    const selected = e.target.value;
    setSelectedMood(selected);
    fetchSelfHelpResources(selected);
  };

  const resetMoodFilter = () => {
    setSelectedMood("");
    fetchSelfHelpResources();
  };

  const handleBackToChat = () => {
    navigate("/chat");
  };

  const moodDescriptions = {
    "Happy 😊": { text: "You're feeling joyful! Let's celebrate your happiness with these resources.", icon: <FaSmile /> },
    "Sad 😔": { text: "I'm here for you during this tough time. Try these comforting activities.", icon: <FaSadTear /> },
    "Angry 😡": { text: "Feeling frustrated? These resources can help you cool down.", icon: <FaAngry /> },
    "Stressed 😟": { text: "Stress can be tough. Let’s find some calm with these tips.", icon: <FaExclamationTriangle /> },
    "Tired 😴": { text: "You seem exhausted. Here are ways to recharge and relax.", icon: <FaTired /> },
    "Excited 🎉": { text: "Your excitement is infectious! Let’s amplify your joy.", icon: <FaBolt /> },
    "Neutral 🙂": { text: "A calm moment—perfect for reflection. Check out this resource.", icon: <FaMeh /> },
  };

  if (loading) {
    return (
      <div className="self-help-container">
        <div className="content-card">
          <div className="loading-spinner" aria-live="polite">
            <div className="spinner"></div>
            <p>Finding resources to support you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-help-container">
        <div className="content-card">
          <p className="error-message" aria-live="assertive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="self-help-container">
      <div className="content-card">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="header-section"
        >
          <h1>
            {userName ? `Hello, ${userName}!` : "Hello!"}{" "}
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="subheader">
            Let’s find resources to match your mood: <span className="mood-highlight">{mood}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mood-filter-section"
        >
          <label htmlFor="mood-select" className="filter-label">
            <FaFilter /> Filter by Mood:
          </label>
          <div className="filter-wrapper">
            <select
              id="mood-select"
              value={selectedMood}
              onChange={handleMoodChange}
              aria-label="Select mood to filter resources"
              className={selectedMood ? "active" : ""}
            >
              <option value="">Based on Latest Mood ({mood})</option>
              {moodOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectedMood && (
              <button
                onClick={resetMoodFilter}
                className="reset-button"
                aria-label="Reset to latest mood"
              >
                <FaRedo /> Reset
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mood-description"
        >
          <div className="mood-description-content">
            {moodDescriptions[mood].icon}
            <p>{moodDescriptions[mood].text}</p>
          </div>
        </motion.div>

        <div className="resources-list">
          <AnimatePresence>
            {resources.length > 0 ? (
              resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="resource-card"
                >
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                    onFocus={() => setShowTooltip(index)}
                    onBlur={() => setShowTooltip(null)}
                    onMouseEnter={() => setShowTooltip(index)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <span className="resource-title">{resource.title}</span>
                    <FaExternalLinkAlt className="external-icon" />
                  </a>
                  <AnimatePresence>
                    {showTooltip === index && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="tooltip"
                      >
                        Click to explore this resource in a new tab!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="no-resources"
              >
                No resources available for this mood.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="back-button-section"
        >
          <button
            onClick={handleBackToChat}
            className="back-button"
            aria-label="Back to Chat"
          >
            <FaArrowLeft /> Back to Chat
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SelfHelp;