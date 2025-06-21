import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Quizzes.css";

// QuizModal component (as updated above)
const QuizModal = ({ quiz, onClose, onSubmit, formatTime }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000); // Fixed: Removed extra parenthesis and added semicolon
    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswer = (questionIndex, score) => {
    setAnswers({ ...answers, [questionIndex]: score });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    let category, suggestion;
    if (totalScore <= 5) {
      category = "Low";
      suggestion = "You seem to be managing well. Keep up your routine!";
    } else if (totalScore <= 10) {
      category = "Moderate";
      suggestion = "You might be experiencing some anxiety. Try our guided breathing exercises.";
    } else {
      category = "High";
      suggestion = "You may be experiencing high anxiety. Consider exploring our meditation library or contacting a professional.";
    }
    const finalElapsedTime = Math.floor((Date.now() - startTime) / 1000);
    setResult({ score: totalScore, category, suggestion, elapsedTime: finalElapsedTime });
    onSubmit({ quizType: quiz.type, score: totalScore, category, elapsedTime: finalElapsedTime });
  };

  const handleShareResult = () => {
    const shareText = `${quiz.title}\nScore: ${result.score}\nResult: ${result.category}\nSuggestion: ${result.suggestion}\nTime Taken: ${formatTime(result.elapsedTime)}`;
    navigator.clipboard.writeText(shareText);
    alert("Result copied to clipboard!");
  };

  const isSubmitEnabled = Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="quiz-modal">
      <div className="quiz-content">
        <h3>{quiz.title}</h3>
        {result ? (
          <div className="quiz-result animate-result">
            <p><strong>Score:</strong> {result.score}</p>
            <p>
              <strong>Result:</strong>{" "}
              <span className={`result-badge result-${result.category.toLowerCase()}`}>
                {result.category}
              </span>
            </p>
            <p>{result.suggestion}</p>
            <p><strong>Time Taken:</strong> {formatTime(result.elapsedTime)}</p>
            <div className="quiz-actions">
              <button
                className="quiz-share-btn"
                onClick={handleShareResult}
                aria-label="Share quiz result"
              >
                Share Result
              </button>
              <button
                className="quiz-close-btn"
                onClick={onClose}
                aria-label="Close quiz modal"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-progress">
              <p>Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
              <p className="quiz-timer">Time: {formatTime(elapsedTime)}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="quiz-question">
              <p>{quiz.questions[currentQuestionIndex].text}</p>
              <div className="quiz-options">
                {["Not at all", "Sometimes", "Often", "Always"].map((option, optIndex) => (
                  <button
                    key={optIndex}
                    className={`quiz-option-btn ${answers[currentQuestionIndex] === optIndex ? "selected" : ""}`}
                    onClick={() => handleAnswer(currentQuestionIndex, optIndex)}
                    aria-pressed={answers[currentQuestionIndex] === optIndex}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="quiz-navigation">
              <button
                className="quiz-back-btn"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                aria-label="Go to previous question"
              >
                Back
              </button>
              <button
                className="quiz-close-btn"
                onClick={onClose}
                aria-label="Close quiz modal"
              >
                Close
              </button>
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  className="quiz-next-btn"
                  onClick={handleNext}
                  disabled={answers[currentQuestionIndex] === undefined}
                  aria-label="Go to next question"
                >
                  Next
                </button>
              ) : (
                <button
                  className="quiz-submit-btn"
                  onClick={calculateResult}
                  disabled={!isSubmitEnabled}
                  aria-label="Submit quiz"
                >
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Quizzes = () => {
  const quizzes = [
    {
      category: "Mental Health",
      items: [
        {
          type: "anxiety",
          title: "Anxiety Assessment",
          questions: [
            { text: "How often do you feel nervous or on edge?" },
            { text: "How often do you feel unable to control worrying?" },
            { text: "How often do you have trouble relaxing?" },
            { text: "How often do you feel restless or on edge?" },
            { text: "How often do you feel afraid something awful might happen?" },
          ],
        },
        {
          type: "depression",
          title: "Depression Screening",
          questions: [
            { text: "How often do you feel sad or hopeless?" },
            { text: "How often do you lack interest in activities you used to enjoy?" },
            { text: "How often do you feel tired or lack energy?" },
            { text: "How often do you have trouble concentrating?" },
            { text: "How often do you feel worthless or guilty?" },
          ],
        },
      ],
    },
    {
      category: "Wellness",
      items: [
        {
          type: "stress",
          title: "Stress Level Check",
          questions: [
            { text: "How often do you feel overwhelmed by your responsibilities?" },
            { text: "How often do you feel unable to cope with daily tasks?" },
            { text: "How often do you feel irritated or angry?" },
            { text: "How often do you have difficulty sleeping due to stress?" },
            { text: "How often do you feel a lack of energy?" },
          ],
        },
        {
          type: "mindfulness",
          title: "Mindfulness Check",
          questions: [
            { text: "How often do you focus on the present moment?" },
            { text: "How often do you notice your thoughts without judging them?" },
            { text: "How often do you feel calm and centered?" },
            { text: "How often do you practice deep breathing or meditation?" },
            { text: "How often do you feel aware of your surroundings?" },
          ],
        },
        {
          type: "sleep",
          title: "Sleep Quality Assessment",
          questions: [
            { text: "How often do you have trouble falling asleep?" },
            { text: "How often do you wake up during the night?" },
            { text: "How often do you feel rested after sleeping?" },
            { text: "How often do you have a consistent sleep schedule?" },
            { text: "How often do you feel sleepy during the day?" },
          ],
        },
      ],
    },
  ];

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Fixed: Corrected setErrorHandler to setError
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "N/A"; // Fixed: Corrected null check
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
          navigate('/login');
          return;
        }

        const response = await fetch("http://localhost:5000/get_quiz_history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Fixed: Corrected template literal
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            throw new Error("Unauthorized access");
          }
          throw new Error("Failed to fetch quiz history");
        }

        const data = await response.json();
        if (data.status === 'success') {
          setQuizHistory(data.data.quiz_history || []);
        } else {
          setError('Failed to load quiz history: ' + data.message);
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching quiz history: ' + (err.message || 'Unknown error'));
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [navigate]);

  const handleSubmit = async (result) => {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        navigate('/login');
        return;
      }

      await fetch("http://localhost:5000/save_quiz_result", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      const response = await fetch("http://localhost:5000/get_quiz_history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        setQuizHistory(data.data.quiz_history || []);
      } else {
        setError('Failed to update quiz history: ' + data.message);
      }
    } catch (err) {
      setError('Error saving quiz result: ' + (err.message || 'Unknown error'));
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleGoToChat = () => {
    navigate('/chat');
  };

  const handleRetakeQuiz = (quizType) => {
    const quiz = quizzes
      .flatMap(category => category.items)
      .find(q => q.type === quizType);
    setSelectedQuiz(quiz);
  };

  const getRecommendedQuiz = () => {
    const latestResult = quizHistory.length > 0 ? quizHistory[0] : null;
    if (latestResult && latestResult.category === "High") {
      if (latestResult.quizType === "anxiety" || latestResult.quizType === "stress") {
        return quizzes.find(cat => cat.category === "Wellness").items.find(q => q.type === "mindfulness"); // Fixed: Corrected title to type
      }
    }
    return null;
  };

  const recommendedQuiz = getRecommendedQuiz();

  const latestResults = quizHistory.reduce((acc, history) => {
    if (!acc[history.quizType] || new Date(history.timestamp) > new Date(acc[history.quizType].timestamp)) {
      acc[history.quizType] = history;
    }
    return acc;
  }, {});

  if (loading) return <div className="text-white text-center">Loading quizzes...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="quizzes-page">
      <div className="header">
        <div className="header-title">
          <svg className="quiz-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2>Self-Assessment Quizzes</h2>
        </div>
        <button
          onClick={handleGoToChat}
          className="go-to-chat-btn"
          aria-label="Go to chat page"
        >
          <span>Go to Chat</span>
          <svg className="chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>

      {recommendedQuiz && (
        <div className="recommended-quiz">
          <h3 className="category-title">Recommended for You</h3>
          <button
            className="quiz-option-btn recommended"
            onClick={() => setSelectedQuiz(recommendedQuiz)}
          >
            <svg className="quiz-option-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {recommendedQuiz.title}
            <span className="recommended-label">Recommended</span>
          </button>
        </div>
      )}

      {quizzes.map((category) => (
        <div key={category.category} className="quiz-category">
          <h3 className="category-title">{category.category}</h3>
          <div className="quiz-list">
            {category.items.map((quiz) => {
              const isCompleted = quizHistory.some(history => history.quizType === quiz.type);
              return (
                <button
                  key={quiz.type}
                  className={`quiz-option-btn ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  <svg className="quiz-option-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.title}
                  {isCompleted && (
                    <svg className="completed-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {quizHistory.length > 0 && (
        <div className="quiz-history">
          <h3 className="category-title">Your Quiz History</h3>
          <div className="history-list">
            {Object.values(latestResults).map((history) => (
              <div
                key={history.id} // Fixed: Using unique id
                className={`history-item ${quizHistory[0]?.id === history.id ? 'latest' : ''}`}
              >
                <span className="history-title">{history.quiz_title}</span>
                <span className="history-score">Score: {history.score}</span>
                <span className={`history-category result-badge result-${history.category.toLowerCase()}`}>
                  {history.category}
                </span>
                <span className="history-time">Time: {formatTime(history.elapsedTime)}</span>
                <span className="history-date">{new Date(history.timestamp).toLocaleString()}</span>
                <button
                  className="retake-btn"
                  onClick={() => handleRetakeQuiz(history.quizType)}
                  aria-label={`Retake ${history.quizType} quiz`}
                >
                  Retake
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onSubmit={handleSubmit} // Fixed: Corrected function reference
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

export default Quizzes;