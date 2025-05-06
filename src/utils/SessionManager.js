import { useState, useEffect } from "react";

const SessionManager = () => {
  const [sessionId, setSessionId] = useState(localStorage.getItem("session_id") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start a new session
  const startSession = async (token) => {
    console.log("Attempting to start session with token:", token); // Debug log
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/start_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("Server response status:", response.status); // Debug log
      const data = await response.json();
      console.log("Server response data:", data); // Debug log
      if (data.status === "success") {
        const newSessionId = data.data.session_id;
        localStorage.setItem("session_id", newSessionId);
        setSessionId(newSessionId);
        console.log("Session started with sessionId:", newSessionId);
        return newSessionId;
      } else {
        throw new Error(data.message || "Failed to start session");
      }
    } catch (err) {
      setError(err.message);
      console.error("Session start error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // End an existing session
  const endSession = async (sessionId, token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/end_session/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        localStorage.removeItem("session_id");
        setSessionId(null);
        return true;
      } else {
        throw new Error(data.message || "Failed to end session");
      }
    } catch (err) {
      setError(err.message);
      console.error("Session end error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get all sessions for the user
  const getSessions = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/get_sessions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        return data.data.sessions;
      } else {
        throw new Error(data.message || "Failed to fetch sessions");
      }
    } catch (err) {
      setError(err.message);
      console.error("Get sessions error:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup session on component unmount or logout
  useEffect(() => {
    return () => {
      if (sessionId) {
        const token = localStorage.getItem("token"); // Use consistent key
        if (token) endSession(sessionId, token);
      }
    };
  }, [sessionId]);

  return { sessionId, isLoading, error, startSession, endSession, getSessions };
};

export default SessionManager;