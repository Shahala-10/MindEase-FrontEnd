import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HappyMomentsGame.css";

const HappyMomentsGame = () => {
  const navigate = useNavigate();

  const prompts = [
    "What’s a happy memory from your childhood?",
    "Describe a time when you laughed the hardest.",
    "What’s a place that always makes you smile?",
    "Who is someone that brings you joy, and why?",
    "What’s a small moment today that made you happy?"
  ];

  const [promptOrder, setPromptOrder] = useState(() => {
    // Initialize with a shuffled array of indices [0, 1, 2, 3, 4]
    return Array.from({ length: prompts.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  });
  const [currentPromptPosition, setCurrentPromptPosition] = useState(0); // Tracks position in the promptOrder
  const [userResponse, setUserResponse] = useState("");
  const [responses, setResponses] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);

  // Check if the game is finished
  useEffect(() => {
    if (currentPromptPosition >= prompts.length) {
      setGameFinished(true);
    }
  }, [currentPromptPosition, prompts.length]);

  const handleSubmit = () => {
    if (userResponse.trim()) {
      const currentPromptIndex = promptOrder[currentPromptPosition];
      setResponses([...responses, { prompt: prompts[currentPromptIndex], response: userResponse }]);
      setUserResponse("");
      setCurrentPromptPosition((prev) => prev + 1);
    }
  };

  const handlePlayAgain = () => {
    // Reshuffle the prompts for a new cycle
    setPromptOrder(Array.from({ length: prompts.length }, (_, i) => i).sort(() => Math.random() - 0.5));
    setCurrentPromptPosition(0);
    setGameFinished(false);
    setUserResponse("");
    // Optionally keep responses: setResponses([]) to clear them
  };

  const handleBackToMiniGames = () => {
    navigate("/mini-games");
  };

  return (
    <div className="happy-moments-game">
      <h3>Happy Moments Game</h3>
      <p>Reflect on joyful memories to boost your mood!</p>
      {gameFinished ? (
        <div className="game-finished">
          <p>You've completed all prompts! Great job reflecting on your happy moments!</p>
          <p>Total Reflections: {responses.length}</p>
          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      ) : (
        <div className="prompt-area">
          <p>
            <strong>Prompt {currentPromptPosition + 1}/{prompts.length}:</strong>{" "}
            {prompts[promptOrder[currentPromptPosition]]}
          </p>
          <textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Write your happy moment here..."
            rows="4"
          />
          <button onClick={handleSubmit}>Save & Next</button>
        </div>
      )}
      {responses.length > 0 && (
        <div className="responses">
          <h4>Your Happy Moments</h4>
          {responses.map((entry, index) => (
            <div key={index} className="response-entry">
              <p><strong>{entry.prompt}</strong></p>
              <p>{entry.response}</p>
            </div>
          ))}
        </div>
      )}
      <button
        className="back-to-mini-games-btn"
        onClick={handleBackToMiniGames}
        aria-label="Back to Mini Games"
      >
        Back to Mini Games
      </button>
    </div>
  );
};

export default HappyMomentsGame;