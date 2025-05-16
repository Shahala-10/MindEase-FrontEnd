import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MemoryMatchGame.css";

const MemoryMatchGame = () => {
  const navigate = useNavigate();

  const cardValues = ["🌟", "🌟", "🍎", "🍎", "🌼", "🌼", "🐾", "🐾"];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const shuffledCards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value, isFlipped: false }));
    setCards(shuffledCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || matchedPairs.includes(index) || flippedCards.includes(index)) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    setMoves(moves + 1);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (newCards[firstIndex].value === newCards[secondIndex].value) {
        setMatchedPairs([...matchedPairs, firstIndex, secondIndex]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === cardValues.length) {
      setGameWon(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPairs]);

  const resetGame = () => {
    const shuffledCards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value, isFlipped: false }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleBackToMiniGames = () => {
    navigate("/mini-games");
  };

  return (
    <div className="memory-match-game">
      <h3>Memory Match Game</h3>
      <p>Flip the cards to find matching pairs!</p>
      <div className="game-stats">
        <p>Moves: {moves}</p>
        <p>Matches: {matchedPairs.length / 2} / {cardValues.length / 2}</p>
      </div>
      {gameWon ? (
        <div className="game-won">
          <p>Congratulations! You won in {moves} moves!</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`card ${card.isFlipped || matchedPairs.includes(index) ? "flipped" : ""}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-inner">
                  <div className="card-front">?</div>
                  <div className="card-back">{card.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="controls">
            <button onClick={resetGame}>Reset Game</button>
          </div>
        </>
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

export default MemoryMatchGame;