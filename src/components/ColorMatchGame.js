import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ColorMatchGame.css";

const ColorMatchGame = () => {
  const navigate = useNavigate();

  const colors = useMemo(() => [
    { name: "Red", value: "#ff0000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Green", value: "#00ff00" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Purple", value: "#800080" },
  ], []); // Empty dependency array since the array is static

  const [targetColor, setTargetColor] = useState("");
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const generateRound = useCallback(() => {
    const correctColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(correctColor.value);

    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    const selectedOptions = shuffledColors.slice(0, 3);
    if (!selectedOptions.some((color) => color.value === correctColor.value)) {
      selectedOptions[0] = correctColor;
    }
    setOptions(selectedOptions.sort(() => Math.random() - 0.5));
    setMessage("");
  }, [colors]);

  useEffect(() => {
    generateRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally omitting 'generateRound' and 'colors' as they are stable

  const handleColorClick = (colorValue) => {
    if (colorValue === targetColor) {
      setScore(score + 1);
      setMessage("Correct! Nice job!");
      setTimeout(() => {
        generateRound();
      }, 1000);
    } else {
      setMessage("Incorrect. Game Over!");
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    generateRound();
  };

  const handleBackToMiniGames = () => {
    navigate("/mini-games");
  };

  return (
    <div className="color-match-game">
      <h3>Color Match Game</h3>
      <p>Match the color shown with one of the options.</p>
      <div className="game-area">
        <div
          className="target-color"
          style={{ backgroundColor: targetColor }}
        ></div>
        <p>Score: {score}</p>
        {gameOver ? (
          <div className="game-over">
            <p>{message}</p>
            <p>Final Score: {score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        ) : (
          <div className="options">
            {options.map((color, index) => (
              <button
                key={index}
                className="color-option"
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorClick(color.value)}
              ></button>
            ))}
            <p>{message}</p>
          </div>
        )}
      </div>
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

export default ColorMatchGame;