import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MiniGames.css";

const MiniGames = () => {
  const [games, setGames] = useState([]);
  const [moodLabel, setMoodLabel] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMiniGames = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
          setError("You need to be logged in to access mini-games.");
          setIsLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/get_mini_games", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.status === "success") {
          setGames(result.data.games || []);
          setMoodLabel(result.data.mood_label || "Unknown");
        } else {
          setError(result.message || "Failed to fetch mini-games.");
        }
      } catch (err) {
        setError("Failed to fetch mini-games. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMiniGames();
  }, []);

  const handlePlayGame = async (game) => {
    try {
      const accessToken = localStorage.getItem("token");
      await fetch("http://localhost:5000/log_game_interaction", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game_id: game.id }),
      });

      if (game.game_type === "memory_match") {
        navigate("/memory-match-game");
      } else if (game.game_type === "color_match") {
        navigate("/color-match-game");
      } else if (game.game_type === "word_scramble") {
        navigate("/word-scramble-game");
      } else if (game.game_type === "mood_puzzle") {
        navigate("/mood-puzzle-game");
      } else if (game.game_type === "happy_moments") {
        navigate("/happy-moments-game");
      }
    } catch (err) {
      setError("Failed to log game interaction.");
    }
  };

  const handleBackToChat = () => {
    navigate("/chat");
  };

  return (
    <div className="mini-games">
      <h3>Stress-Relief Mini-Games</h3>
      {error ? (
        <>
          <p className="error">{error}</p>
          <button
            className="back-to-chat-btn"
            onClick={handleBackToChat}
            aria-label="Back to Chat"
          >
            Back to Chat
          </button>
        </>
      ) : isLoading ? (
        <>
          <p>Loading...</p>
          <button
            className="back-to-chat-btn"
            onClick={handleBackToChat}
            aria-label="Back to Chat"
          >
            Back to Chat
          </button>
        </>
      ) : games.length > 0 ? (
        <>
          <p>
            Based on your mood: <strong>{moodLabel}</strong>
          </p>
          <div className="game-list">
            {games.map((game) => (
              <div key={game.id} className="game-item">
                <h4>{game.title}</h4>
                <p>{game.description}</p>
                <p className="game-meta">
                  Suggested for: {game.mood_label} | Stress Level: {game.stress_level}
                </p>
                <button
                  className="play-btn"
                  onClick={() => handlePlayGame(game)}
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
          <button
            className="back-to-chat-btn"
            onClick={handleBackToChat}
            aria-label="Back to Chat"
          >
            Back to Chat
          </button>
        </>
      ) : (
        <>
          <p>No mini-games available for your current mood. Try a quiz or chat to update your mood!</p>
          <button
            className="back-to-chat-btn"
            onClick={handleBackToChat}
            aria-label="Back to Chat"
          >
            Back to Chat
          </button>
        </>
      )}
    </div>
  );
};

export default MiniGames;