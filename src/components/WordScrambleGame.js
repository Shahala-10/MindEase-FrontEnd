import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./WordScrambleGame.css";

const WordScrambleGame = () => {
  const navigate = useNavigate();

  const words = useMemo(() => [
    "calm", "peace", "relax", "smile", "happy", "joy", "glow", "hope", "love", "bliss"
  ], []); // Empty dependency array since the array is static

  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // Scramble a word
  const scrambleWord = (word) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  // Initialize the game with the current word
  useEffect(() => {
    if (wordIndex < words.length) {
      const word = words[wordIndex];
      setCurrentWord(word);
      setScrambledWord(scrambleWord(word));
      setUserGuess("");
      setMessage("");
    }
  }, [wordIndex, words]);

  const handleGuess = () => {
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1);
      setMessage("Correct! Great job!");
      setTimeout(() => {
        const nextIndex = wordIndex + 1;
        if (nextIndex < words.length) {
          setWordIndex(nextIndex);
        } else {
          setGameFinished(true);
        }
      }, 1000);
    } else {
      setMessage("Try again!");
    }
  };

  const handlePlayAgain = () => {
    setWordIndex(0);
    setScore(0);
    setGameFinished(false);
    setMessage("");
    setUserGuess("");
  };

  const handleBackToMiniGames = () => {
    navigate("/mini-games");
  };

  return (
    <div className="word-scramble-game">
      <h3>Word Scramble Game</h3>
      <p>Unscramble the word to relax your mind!</p>
      {gameFinished ? (
        <div className="game-finished">
          <p>Congratulations! You've unscrambled all words!</p>
          <p>Final Score: {score}</p>
          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      ) : (
        <div className="game-area">
          <p>Scrambled Word: <strong>{scrambledWord}</strong></p>
          <p>Progress: {wordIndex + 1}/{words.length}</p>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Enter your guess"
            disabled={message === "Correct! Great job!"}
          />
          <button onClick={handleGuess}>Submit Guess</button>
          <p>{message}</p>
          <p>Score: {score}</p>
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

export default WordScrambleGame;