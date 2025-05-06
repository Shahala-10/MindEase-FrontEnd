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

  const mapMoodLabel = (label) => {
    if (!label) return "Neutral";
    switch (label.toLowerCase()) {
      case "positive":
        return "Happy";
      case "negative":
        return "Sad";
      default:
        return "Neutral";
    }
  };

  const handleFilterChange = (mood) => {
    setFilter(mood);
    if (mood === "All") {
      setFilteredMoods(moodHistory);
    } else {
      const filtered = moodHistory.filter((entry) => mapMoodLabel(entry.bert_label) === mood);
      setFilteredMoods(filtered);
    }
  };

  const prepareLineChartData = () => {
    const timestamps = filteredMoods.map((entry) => new Date(entry.timestamp).toLocaleString());
    const scores = filteredMoods.map((entry) => entry.bert_score || 0);
    const moodLabels = filteredMoods.map((entry) => mapMoodLabel(entry.bert_label));

    return {
      labels: timestamps,
      datasets: [
        {
          label: "Mood Score Trend",
          data: scores,
          fill: true,
          borderColor: "#4A90E2",
          backgroundColor: "rgba(74, 144, 226, 0.2)",
          tension: 0.3,
          pointBackgroundColor: moodLabels.map((mood) =>
            mood === "Happy" ? "#50E3C2" : mood === "Sad" ? "#FF6B6B" : "#F5A623"
          ),
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#4A90E2",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14, family: "'Inter', sans-serif" } } },
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
            const mood = filteredMoods[context.dataIndex]
              ? mapMoodLabel(filteredMoods[context.dataIndex].bert_label)
              : "Neutral";
            return `${label}: ${value.toFixed(2)} - ${mood}`;
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
                          className={`mood-indicator mood-${mapMoodLabel(entry.bert_label).toLowerCase()}`}
                        >
                          {mapMoodLabel(entry.bert_label) === "Happy" && <FaSmile />}
                          {mapMoodLabel(entry.bert_label) === "Sad" && <FaFrown />}
                          {mapMoodLabel(entry.bert_label) === "Neutral" && <FaMeh />}
                          {mapMoodLabel(entry.bert_label)}
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