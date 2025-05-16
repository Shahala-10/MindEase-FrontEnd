import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MoodPuzzleGame.css";

const puzzleImages = [
  `${process.env.PUBLIC_URL}/SMILE.png`,
  `${process.env.PUBLIC_URL}/flower.png`,
];

export default function MoodPuzzleGame() {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [currentImage, setCurrentImage] = useState(puzzleImages[0]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Function to perform a single valid move (for shuffling)
  const performRandomMove = (currentPieces) => {
    const emptyPieceIndex = currentPieces.findIndex((piece) => piece.order === 8);
    const row = Math.floor(emptyPieceIndex / 3);
    const col = emptyPieceIndex % 3;

    // Determine valid adjacent positions
    const adjacentPositions = [];
    if (col > 0) adjacentPositions.push(emptyPieceIndex - 1); // Left
    if (col < 2) adjacentPositions.push(emptyPieceIndex + 1); // Right
    if (row > 0) adjacentPositions.push(emptyPieceIndex - 3); // Above
    if (row < 2) adjacentPositions.push(emptyPieceIndex + 3); // Below

    // Pick a random adjacent position to swap with
    const randomAdjacentIndex = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
    const newPieces = [...currentPieces];
    [newPieces[emptyPieceIndex].order, newPieces[randomAdjacentIndex].order] = [
      newPieces[randomAdjacentIndex].order,
      newPieces[emptyPieceIndex].order,
    ];
    return newPieces;
  };

  // Shuffle by performing random valid moves
  useEffect(() => {
    // Start with a solved state
    let newPieces = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      order: i,
      correctOrder: i,
    }));

    // Perform 100 random valid moves to shuffle (ensures solvability)
    for (let i = 0; i < 100; i++) {
      newPieces = performRandomMove(newPieces);
    }

    setPieces(newPieces);
    setCompleted(false);
    setImageLoaded(false);
    setImageError(null);

    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
      console.log("Image loaded successfully:", currentImage);
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Image failed to load:", currentImage);
      setImageError("Failed to load image – pick another 🙂");
    };
  }, [currentImage]);

  const handlePieceClick = (index) => {
    const emptyPieceIndex = pieces.findIndex((piece) => piece.order === 8);
    const clickedPieceIndex = pieces.findIndex((piece) => piece.id === index);

    console.log("Clicked piece index:", clickedPieceIndex, "Empty piece index:", emptyPieceIndex);

    // Determine valid adjacent positions based on grid boundaries
    const adjacentPositions = [];
    const row = Math.floor(emptyPieceIndex / 3);
    const col = emptyPieceIndex % 3;

    if (col > 0) adjacentPositions.push(emptyPieceIndex - 1);
    if (col < 2) adjacentPositions.push(emptyPieceIndex + 1);
    if (row > 0) adjacentPositions.push(emptyPieceIndex - 3);
    if (row < 2) adjacentPositions.push(emptyPieceIndex + 3);

    console.log("Adjacent positions:", adjacentPositions);

    if (!adjacentPositions.includes(clickedPieceIndex)) {
      console.log("Not adjacent, no swap performed.");
      return;
    }

    const newPieces = [...pieces];
    [newPieces[emptyPieceIndex].order, newPieces[clickedPieceIndex].order] = [
      newPieces[clickedPieceIndex].order,
      newPieces[emptyPieceIndex].order,
    ];
    console.log("Swapped pieces. New order:", newPieces.map((p) => p.order));

    setPieces(newPieces);

    // Check if puzzle is solved (ignore the empty piece)
    const isSolved = newPieces.every((piece) => piece.order === 8 || piece.order === piece.correctOrder);
    console.log("Is puzzle solved?", isSolved);
    console.log(
      "Pieces state:",
      newPieces.map((p) => ({ id: p.id, order: p.order, correctOrder: p.correctOrder }))
    );
    if (isSolved) {
      setCompleted(true);
    }
  };

  const resetPuzzle = () => {
    let newPieces = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      order: i,
      correctOrder: i,
    }));

    for (let i = 0; i < 100; i++) {
      newPieces = performRandomMove(newPieces);
    }

    setPieces(newPieces);
    setCompleted(false);
    setImageLoaded(false);
  };

  const changeImage = (image) => {
    setCurrentImage(image);
  };

  const handleBackToMiniGames = () => {
    navigate("/mini-games");
  };

  return (
    <div className="mood-puzzle-game">
      <h3>Mood Puzzle Game</h3>
      <p>Arrange the pieces to complete the cheerful image!</p>
      {imageError && <p className="error">{imageError}</p>}
      <div className="image-selector">
        {puzzleImages.map((image, index) => (
          <button
            key={index}
            className={currentImage === image ? "active" : ""}
            onClick={() => changeImage(image)}
            aria-label={`Select Image ${index + 1}`}
          >
            Image {index + 1}
          </button>
        ))}
      </div>
      {!imageLoaded && !imageError && <p>Loading image...</p>}
      {completed ? (
        <div className="completed">
          <p>Congratulations! Puzzle completed!</p>
          {imageLoaded && !imageError && (
            <img
              src={currentImage}
              alt="Completed Puzzle"
              className="completed-image"
              onError={() => {
                console.error("Completed image failed to load:", currentImage);
                setImageError("Failed to load completed image.");
              }}
            />
          )}
          <button onClick={resetPuzzle} aria-label="Play Again">
            Play Again
          </button>
        </div>
      ) : (
        <div className="puzzle-grid">
          {imageLoaded && !imageError ? (
            pieces.map((piece) => (
              <div
                key={piece.id}
                className={`puzzle-piece ${piece.order === 8 ? "empty" : ""}`}
                onClick={() => piece.order !== 8 && handlePieceClick(piece.id)}
                style={{
                  backgroundImage: piece.order !== 8 ? `url(${currentImage})` : "none",
                  backgroundSize: "300px 300px",
                  backgroundPosition: `${-(piece.order % 3) * 100}px ${-Math.floor(piece.order / 3) * 100}px`,
                }}
                role="button"
                tabIndex={piece.order !== 8 ? 0 : -1}
                aria-label={`Puzzle piece ${piece.correctOrder + 1}${piece.order === 8 ? " (empty)" : ""}`}
                onKeyDown={(e) => e.key === "Enter" && piece.order !== 8 && handlePieceClick(piece.id)}
              />
            ))
          ) : (
            <p>{imageError || "Loading puzzle pieces..."}</p>
          )}
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
}