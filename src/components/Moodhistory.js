import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaFilter, FaSmile, FaFrown, FaMeh } from "react-icons/fa";
import "./Moodhistory.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [filteredMoods, setFilteredMoods] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMoodHistory = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/get_mood_history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "success") {
          const moodList = response.data.data.mood_history;
          setMoodHistory(moodList);
          setFilteredMoods(moodList);
          localStorage.setItem("moodHistory", JSON.stringify(moodList));
        } else {
          throw new Error(response.data.message || "Failed to fetch mood history");
        }
      } catch (error) {
        console.error("Error fetching mood history:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          const savedHistory = localStorage.getItem("moodHistory");
          if (savedHistory) {
            const moodList = JSON.parse(savedHistory);
            setMoodHistory(moodList);
            setFilteredMoods(moodList);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodHistory();
  }, [navigate]);

  // Extract the text part of mood_label (e.g., "Happy" from "Happy 😊")
  const mapMoodLabel = (label) => {
    if (!label) return "Neutral";
    return label.split(" ")[0]; // Take the first word, e.g., "Happy" from "Happy 😊"
  };

  // Determine the emoji icon based on mood_label
  const getMoodEmoji = (label) => {
    if (!label) return <FaMeh />;
    const moodText = mapMoodLabel(label).toLowerCase();
    if (moodText === "happy" || moodText === "excited") return <FaSmile />;
    if (moodText === "sad" || moodText === "angry" || moodText === "stressed" || moodText === "tired") return <FaFrown />;
    return <FaMeh />;
  };

  const handleFilterChange = (mood) => {
    setFilter(mood);
    if (mood === "All") {
      setFilteredMoods(moodHistory);
    } else {
      const filtered = moodHistory.filter((entry) => mapMoodLabel(entry.mood_label) === mood);
      setFilteredMoods(filtered);
    }
  };

  const prepareLineChartData = () => {
    const timestamps = filteredMoods.map((entry) => new Date(entry.timestamp).toLocaleString());
    const scores = filteredMoods.map((entry) => entry.bert_score || 0);
    const moodLabels = filteredMoods.map((entry) => mapMoodLabel(entry.mood_label).toLowerCase());

    // Define mood colors
    const moodColors = {
      happy: "#50E3C2",
      excited: "#a855f7",
      sad: "#3b82f6",
      angry: "#B91C1C",
      stressed: "#f97316",
      tired: "#6b7280",
      neutral: "#F5A623",
    };

    // Create the main "Mood Score Trend" dataset for the continuous line
    const trendDataset = {
      label: "Mood Score Trend",
      data: scores,
      fill: true,
      borderColor: "#9CA3AF", // Gray for the trend line
      backgroundColor: "rgba(156, 163, 175, 0.2)", // Light gray fill
      tension: 0.3,
      pointBackgroundColor: "#9CA3AF",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#9CA3AF",
      pointRadius: 0, // Hide points for this dataset (we'll show points in mood datasets)
      pointHoverRadius: 0,
    };

    // Create a dataset for each mood
    const moodDatasets = Object.keys(moodColors).map((mood) => ({
      label: mood.charAt(0).toUpperCase() + mood.slice(1), // Capitalize mood for legend (e.g., "Happy")
      data: scores.map((score, index) =>
        moodLabels[index] === mood ? score : null // Only include score if the mood matches
      ),
      fill: false,
      borderColor: moodColors[mood],
      backgroundColor: moodColors[mood],
      pointBackgroundColor: moodColors[mood],
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: moodColors[mood],
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false, // Don't draw lines for mood datasets, only points
    }));

    return {
      labels: timestamps,
      datasets: [trendDataset, ...moodDatasets],
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Enable the chart's legend
        position: "bottom",
        labels: {
          font: { family: "'Inter', sans-serif", size: 12 },
          color: "#333",
          usePointStyle: true, // Use circular point style for legend items
          padding: 15,
          generateLabels: (chart) => {
            const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            const moodColors = {
              Happy: "#50E3C2",
              Excited: "#a855f7",
              Sad: "#3b82f6",
              Angry: "#B91C1C",
              Stressed: "#f97316",
              Tired: "#6b7280",
              Neutral: "#F5A623",
            };
            return originalLabels.map((label) => {
              if (label.text === "Mood Score Trend") {
                return {
                  ...label,
                  fillStyle: "#9CA3AF", // Gray for the trend line
                  strokeStyle: "#9CA3AF",
                  hidden: false,
                };
              }
              return {
                ...label,
                fillStyle: moodColors[label.text] || "#9CA3AF",
                strokeStyle: moodColors[label.text] || "#9CA3AF",
                hidden: false,
              };
            });
          },
        },
      },
      title: {
        display: true,
        text: "Mood Score Trend Over Time",
        font: { size: 18, family: "'Inter', sans-serif", weight: "600" },
        color: "#333",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { family: "'Inter', sans-serif" },
        bodyFont: { family: "'Inter', sans-serif" },
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            const index = context.dataIndex;
            const mood = filteredMoods[index]
              ? mapMoodLabel(filteredMoods[index].mood_label)
              : "Neutral";
            if (label === "Mood Score Trend") {
              return `${label}: ${value.toFixed(2)} - ${mood}`;
            }
            return `${mood}: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Mood Score",
          font: { size: 14, family: "'Inter', sans-serif", weight: "500" },
          color: "#666",
        },
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.1,
          font: { family: "'Inter', sans-serif" },
          color: "#666",
        },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: {
        title: {
          display: true,
          text: "Time",
          font: { size: 14, family: "'Inter', sans-serif", weight: "500" },
          color: "#666",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { family: "'Inter', sans-serif" },
          color: "#666",
        },
        grid: { display: false },
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="mood-history-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="mood-history-title">Your Mood History</h2>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your mood history...</p>
        </div>
      ) : moodHistory.length === 0 ? (
        <div className="no-history">
          <FaMeh className="no-history-icon" />
          <p>No mood history yet! Start a chat to track your moods.</p>
        </div>
      ) : (
        <div className="mood-history-content">
          <div className="filter-bar">
            <label htmlFor="mood-filter" className="filter-label">
              <FaFilter /> Filter Moods:
            </label>
            <select
              id="mood-filter"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              aria-label="Filter moods"
            >
              <option value="All">All Moods</option>
              <option value="Happy">Happy</option>
              <option value="Sad">Sad</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>

          <div className="chart-wrapper">
            <Line data={prepareLineChartData()} options={lineChartOptions} />
          </div>

          <div className="history-list">
            <h3>Recent Moods</h3>
            <div className="history-list-scroll">
              <AnimatePresence>
                {filteredMoods
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <motion.div
                      key={entry.mood_id}
                      className="history-entry"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="entry-header">
                        <span className="entry-timestamp">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                        <span
                          className={`mood-indicator mood-${mapMoodLabel(entry.mood_label).toLowerCase()}`}
                        >
                          {getMoodEmoji(entry.mood_label)}
                          {mapMoodLabel(entry.mood_label)}
                        </span>
                      </div>
                      <p className="entry-message">{entry.message || "No message provided"}</p>
                      <p className="entry-score">
                        Mood Score: {entry.bert_score?.toFixed(2) || "N/A"}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <button
        className="fab-back-button"
        onClick={() => navigate("/chat")}
        aria-label="Back to chat"
      >
        <FaArrowLeft />
      </button>
    </motion.div>
  );
};

export default MoodHistory;