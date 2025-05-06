import axios from "axios";

// Flask API Base URL
const API = axios.create({
  baseURL: "http://127.0.0.1:5000", // Flask backend URL (make sure this is correct)
  headers: {
    "Content-Type": "application/json", // Ensure the content type is JSON
  },
});

// Login API Call
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/login", { email, password });
    return response.data; // Return response data
  } catch (error) {
    console.error("Login Error: ", error);
    throw new Error(error.response ? error.response.data.error : "Something went wrong during login.");
  }
};

// Register API Call
export const registerUser = async (firstName, lastName, email, password) => {
  try {
    const response = await API.post("/register", {
      first_name: firstName,  // Use `first_name` here
      last_name: lastName,    // Use `last_name` here
      email: email,
      password: password,
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Registration Error: ", error);
    throw new Error(error.response ? error.response.data.error : "Something went wrong during registration.");
  }
};

// Add User API Call (Assuming you have this functionality in your backend)
export const addUser = async (username, email) => {
  try {
    const response = await API.post("/add_user", {
      username: username,
      email: email,
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Add User Error: ", error);
    throw new Error(error.response ? error.response.data.error : "Error while adding user.");
  }
};

// Start Session API Call
export const startSession = async (userId) => {
  try {
    const response = await API.post("/start_session", { user_id: userId });
    return response.data; // Return session data
  } catch (error) {
    console.error("Start Session Error: ", error);
    throw new Error(error.response ? error.response.data.error : "Error starting session.");
  }
};

// End Session API Call
export const endSession = async (sessionId) => {
  try {
    const response = await API.put(`/end_session/${sessionId}`);
    return response.data; // Return end session response
  } catch (error) {
    console.error("End Session Error: ", error);
    throw new Error(error.response ? error.response.data.error : "Error ending session.");
  }
};

// Analyze Message API Call (This will analyze user messages for sentiment)
export const analyzeMessage = async (userId, sessionId, message) => {
  try {
    const response = await API.post("/analyze", {
      user_id: userId,
      session_id: sessionId,
      message: message,
    });
    return response.data; // Return analyzed data (sentiment, message, etc.)
  } catch (error) {
    console.error("Analyze Message Error: ", error);
    throw new Error(error.response ? error.response.data.error : "Error analyzing message.");
  }
};

// Fetch Chat History for a session
export const getChatHistory = async (sessionId) => {
  try {
    const response = await API.get(`/get_chats/${sessionId}`);
    return response.data; // Return chat history
  } catch (error) {
    console.error("Fetch Chat History Error: ", error);
    throw new Error(error.response ? error.response.data.error : "Error fetching chat history.");
  }
};

export default API;
