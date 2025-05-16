
/* global webkitSpeechRecognition */
import "animate.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios"; 
import { FaQuestionCircle } from "react-icons/fa";
import { BiLineChart } from "react-icons/bi"; 
import "./Chat.css";
import { FaGamepad } from "react-icons/fa";

import {
  FaPaperPlane,
  FaTrash,
  FaMicrophone,
  FaCamera,
  FaVolumeUp,
  FaPause,
  FaBars,
  FaUser,
  FaHistory,
  FaBook,
  FaSignOutAlt,
  FaSpinner,

} from "react-icons/fa";
import SessionManager from "./utils/SessionManager";

// Function to convert WebM to WAV using the Web Audio API
const convertWebMToWav = (webmBlob) => {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const fileReader = new FileReader();

    fileReader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Create a WAV file
        const wavBuffer = audioBufferToWav(audioBuffer);
        const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
        resolve(wavBlob);
      } catch (error) {
        reject(error);
      }
    };

    fileReader.onerror = (error) => reject(error);
    fileReader.readAsArrayBuffer(webmBlob);
  });
};

// Helper function to convert AudioBuffer to WAV
const audioBufferToWav = (buffer) => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);

  // WAV header
  const sampleRate = buffer.sampleRate;
  const bitsPerSample = 16;
  let offset = 0;

  writeString(view, offset, "RIFF");
  offset += 4;
  view.setUint32(offset, length - 8, true);
  offset += 4;
  writeString(view, offset, "WAVE");
  offset += 4;
  writeString(view, offset, "fmt ");
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2; // PCM format
  view.setUint16(offset, numOfChan, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * numOfChan * (bitsPerSample / 8), true);
  offset += 4;
  view.setUint16(offset, numOfChan * (bitsPerSample / 8), true);
  offset += 2;
  view.setUint16(offset, bitsPerSample, true);
  offset += 2;
  writeString(view, offset, "data");
  offset += 4;
  view.setUint32(offset, length - offset - 4, true);
  offset += 4;

  // Write PCM audio data
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      const sample = buffer.getChannelData(channel)[i];
      const value = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
      view.setInt16(offset, value, true);
      offset += 2;
    }
  }

  return bufferArray;
};

const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const chatVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages).map((msg) => ({
          ...msg,
          audioBlob: null,
          timestamp: msg.timestamp || new Date().toISOString(),
        }))
      : [];
  });
  const [userName, setUserName] = useState("");
  const [timeGreetingWithName, setTimeGreetingWithName] = useState("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentTTSMessageIndex, setCurrentTTSMessageIndex] = useState(null);
  const [isTTSPaused, setIsTTSPaused] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en-US"); // Language state (English or Malayalam)

  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const navigate = useNavigate();
  const { sessionId, isLoading: sessionLoading, startSession, endSession } = SessionManager();
  const [chatRef, chatInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Format timestamp for individual messages
  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date label for group headers
  const formatDateLabel = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();
    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return messageDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((msg, index) => {
      const messageDate = new Date(msg.timestamp).toISOString().split("T")[0];
      if (messageDate !== currentDate) {
        grouped.push({ type: "date", date: msg.timestamp, id: `date-${messageDate}` });
        currentDate = messageDate;
      }
      grouped.push({ type: "message", data: msg, id: index });
    });

    return grouped;
  };

  useEffect(() => {
    const fetchUserAndChatHistory = async () => {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("token");
        const userResponse = await axios.get("http://localhost:5000/get_user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const fullName = userResponse.data.data.full_name;
        setUserName(fullName);

        const timeGreeting = getTimeBasedGreeting();
        setTimeGreetingWithName(`${timeGreeting}${fullName ? `, ${fullName}` : ""}.`);

        if (accessToken && sessionId) {
          const chatResponse = await axios.get(`http://localhost:5000/get_chats/${sessionId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (chatResponse.data.data.chats?.length > 0) {
            const backendMessages = chatResponse.data.data.chats
              .map((chat) => [
                { text: chat.message, sender: "user", timestamp: new Date().toISOString() },
                { text: chat.response || "", sender: "bot", timestamp: new Date().toISOString() },
              ])
              .flat();
            setMessages((prev) => {
              const mergedMessages = [
                ...prev,
                ...backendMessages.filter((bm) => !prev.some((pm) => pm.text === bm.text)),
              ];
              localStorage.setItem(
                "chatMessages",
                JSON.stringify(
                  mergedMessages.map((msg) => ({
                    text: msg.text,
                    sender: msg.sender,
                    imageSrc: msg.imageSrc,
                    timestamp: msg.timestamp,
                  }))
                )
              );
              return mergedMessages;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user or chat history:", error);
        const timeGreeting = getTimeBasedGreeting();
        setTimeGreetingWithName(`${timeGreeting}.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndChatHistory();
  }, [sessionId]);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      navigate("/login");
    } else if (!sessionId && !sessionLoading) {
      startSession(accessToken);
    }
  }, [navigate, sessionId, sessionLoading, startSession]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current && messages.length > 0) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      localStorage.setItem(
        "chatMessages",
        JSON.stringify(
          messages.map((msg) => ({
            text: msg.text,
            sender: msg.sender,
            imageSrc: msg.imageSrc,
            timestamp: msg.timestamp,
          }))
        )
      );
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language; // Set language dynamically

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Error in speech recognition. Please try again.",
            sender: "bot",
            moodLabel: "Neutral 🙂",
            timestamp: new Date().toISOString(),
          },
        ]);
      };
    }
  }, [language]);

  const startRecording = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: "microphone" });
      if (permissionStatus.state === "denied") {
        alert(
          "Microphone access is denied. Please enable microphone permissions in your browser settings to record audio."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = async () => {
        const recordingDuration = (Date.now() - recordingStartTime) / 1000;
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);

        if (recordingDuration < 1) {
          setMessages((prev) => [
            ...prev,
            {
              text: "Recording too short. Please record for at least 1 second.",
              sender: "bot",
              moodLabel: "Neutral 🙂",
              timestamp: new Date().toISOString(),
            },
          ]);
          audioChunksRef.current = [];
          return;
        }

        if (audioChunksRef.current.length === 0 || audioChunksRef.current.every((chunk) => chunk.size === 0)) {
          setMessages((prev) => [
            ...prev,
            {
              text: "No audio detected. Please ensure your microphone is working and speak clearly.",
              sender: "bot",
              moodLabel: "Neutral 🙂",
              timestamp: new Date().toISOString(),
            },
          ]);
          audioChunksRef.current = [];
          return;
        }

        const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (webmBlob.size < 100) {
          setMessages((prev) => [
            ...prev,
            {
              text: "The recorded audio is too small to process. Please record a longer message (at least 1 second).",
              sender: "bot",
              moodLabel: "Neutral 🙂",
              timestamp: new Date().toISOString(),
            },
          ]);
          audioChunksRef.current = [];
          return;
        }

        let wavBlob;
        try {
          wavBlob = await convertWebMToWav(webmBlob);
        } catch (error) {
          console.error("Error converting WebM to WAV:", error);
          setMessages((prev) => [
            ...prev,
            {
              text: "Failed to process the recorded audio format. Please try recording again or type your message instead.",
              sender: "bot",
              moodLabel: "Neutral 🙂",
              timestamp: new Date().toISOString(),
            },
          ]);
          audioChunksRef.current = [];
          return;
        }

        const audioUrl = URL.createObjectURL(wavBlob);
        const audio = new Audio(audioUrl);
        audio.onloadedmetadata = () => {
          if (audio.duration < 1) {
            setMessages((prev) => [
              ...prev,
              {
                text: "The recorded audio duration is too short. Please record for at least 1 second and speak clearly.",
                sender: "bot",
                moodLabel: "Neutral 🙂",
                timestamp: new Date().toISOString(),
              },
            ]);
            URL.revokeObjectURL(audioUrl);
            audioChunksRef.current = [];
            return;
          }

          audio.play().then(() => {
            audioChunksRef.current = [];
            sendMessage(null, wavBlob);
            URL.revokeObjectURL(audioUrl);
          }).catch((error) => {
            console.error("Playback test failed:", error);
            setMessages((prev) => [
              ...prev,
              {
                text: "The recorded audio appears to be silent or corrupted. Please ensure your microphone is working and speak clearly.",
                sender: "bot",
                moodLabel: "Neutral 🙂",
                timestamp: new Date().toISOString(),
              },
            ]);
            URL.revokeObjectURL(audioUrl);
            audioChunksRef.current = [];
          });
        };
      };
      mediaRecorderRef.current.start();
      setRecordingStartTime(Date.now());
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
        setRecordingTime(duration);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording. Please check microphone permissions and ensure your microphone is working.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const adjustTTSForEmotion = (speech, moodLabel) => {
    switch (moodLabel) {
      case "Sad 😔":
        speech.rate = 0.8;
        speech.pitch = 0.9;
        break;
      case "Angry 😡":
        speech.rate = 0.9;
        speech.pitch = 1.0;
        break;
      case "Happy 😊":
        speech.rate = 1.1;
        speech.pitch = 1.2;
        break;
      case "Tired 😴":
        speech.rate = 0.8;
        speech.pitch = 0.9;
        break;
      case "Stressed 😟":
        speech.rate = 0.85;
        speech.pitch = 0.95;
        break;
      case "Neutral 🙂":
      default:
        speech.rate = 1.0;
        speech.pitch = 1.0;
    }
  };

  const speak = (text, messageIndex, moodLabel = "Neutral 🙂") => {
    if ("speechSynthesis" in window) {
      if (currentTTSMessageIndex !== null && currentTTSMessageIndex !== messageIndex) {
        window.speechSynthesis.cancel();
        setCurrentTTSMessageIndex(null);
        setIsTTSPaused(false);
      }

      if (currentTTSMessageIndex === messageIndex && isTTSPaused) {
        window.speechSynthesis.resume();
        setIsTTSPaused(false);
      } else if (currentTTSMessageIndex === messageIndex && !isTTSPaused) {
        window.speechSynthesis.pause();
        setIsTTSPaused(true);
      } else {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = language; // Set language dynamically

        // Select a voice that supports the chosen language
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find((v) => v.lang === language) || voices[0];
        speech.voice = voice;

        adjustTTSForEmotion(speech, moodLabel);
        speech.onend = () => {
          setCurrentTTSMessageIndex(null);
          setIsTTSPaused(false);
        };
        window.speechSynthesis.speak(speech);
        speechRef.current = speech;
        setCurrentTTSMessageIndex(messageIndex);
        setIsTTSPaused(false);
      }
    }
  };

  const sendMessage = async (text, audioBlob = null, imageSrc = null) => {
    if (!text && !audioBlob && !imageSrc) return;

    let userMessage;
    if (audioBlob) {
      userMessage = {
        text: "Voice message sent 🎙️",
        sender: "user",
        audioBlob,
        imageSrc,
        isAudio: true,
        timestamp: new Date().toISOString(),
      };
    } else {
      userMessage = {
        text: imageSrc ? "Image sent 📷" : text,
        sender: "user",
        audioBlob,
        imageSrc,
        timestamp: new Date().toISOString(),
      };
    }

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      localStorage.setItem(
        "chatMessages",
        JSON.stringify(
          newMessages.map((msg) => ({
            text: msg.text,
            sender: msg.sender,
            imageSrc: msg.imageSrc,
            timestamp: msg.timestamp,
          }))
        )
      );
      return newMessages;
    });
    setInput("");
    setIsTyping(true);
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("token");
      if (!sessionId) throw new Error("No active session. Please try again.");

      let botResponseText = "";
      let moodLabel = "Neutral 🙂";

      if (audioBlob) {
        const formData = new FormData();
        formData.append("session_id", sessionId);
        formData.append("audio", audioBlob, "recording.wav");
        formData.append("language", language); // Send language to backend
        formData.append("conversation_history", JSON.stringify([]));

        const response = await axios.post("http://localhost:5000/analyze", formData, {
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" },
        });

        const transcribedText = response.data.data.message;
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.length - 1;
          if (updatedMessages[lastMessageIndex].isAudio) {
            updatedMessages[lastMessageIndex].transcribedText = transcribedText;
            if (transcribedText.includes("[Transcription") || transcribedText.includes("[Voice input")) {
              updatedMessages[lastMessageIndex].text = "Voice message (transcription failed)";
            } else {
              updatedMessages[lastMessageIndex].text = `Voice message: ${transcribedText}`;
            }
          }
          localStorage.setItem(
            "chatMessages",
            JSON.stringify(
              updatedMessages.map((msg) => ({
                text: msg.text,
                sender: msg.sender,
                imageSrc: msg.imageSrc,
                timestamp: msg.timestamp,
              }))
            )
          );
          return updatedMessages;
        });

        botResponseText = response.data.data.response;
        moodLabel = response.data.data.mood_label;

        const selfHelp = response.data.data.self_help;
        if (selfHelp?.length > 0 && selfHelp[0].title !== "No resources available at the moment.") {
          botResponseText += `\n\nWould you like to explore self-help resources for ${moodLabel}? Click the 'Self-Help' button above!`;
        }

        localStorage.setItem("latestMood", moodLabel);
        localStorage.setItem("selfHelpResource", JSON.stringify(selfHelp));
      } else if (text && !imageSrc) {
        let recentMessages = [];
        const historyResponse = await axios.get(`http://localhost:5000/get_chats/${sessionId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        recentMessages = [
          ...historyResponse.data.data.chats
            .map((chat) => [
              { role: "user", content: chat.message },
              { role: "assistant", content: chat.response || "" },
            ])
            .flat(),
          ...messages
            .filter((msg) => !msg.audioBlob && !msg.imageSrc)
            .map((msg) => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text })),
        ].slice(-10);
        recentMessages.push({ role: "user", content: text });

        const response = await axios.post(
          "http://localhost:5000/analyze",
          { session_id: sessionId, message: text, conversation_history: recentMessages, language },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        botResponseText = response.data.data.response;
        moodLabel = response.data.data.mood_label;

       const selfHelp = response.data.data.self_help;
        //if (selfHelp?.length > 0 && selfHelp[0].title !== "No resources available at the moment.") {
         // botResponseText += `\n\nWould you like to explore self-help resources for ${moodLabel}? Click the 'Self-Help' button above!`;
       // }

        localStorage.setItem("latestMood", moodLabel);
        localStorage.setItem("selfHelpResource", JSON.stringify(selfHelp));
      } else {
        botResponseText = imageSrc
          ? "Thank you for sharing the image. I’m here for you—would you like to talk more about what this means to you?"
          : "I’m here to listen. Would you like to share more?";
      }

      const botResponse = { text: botResponseText, sender: "bot", moodLabel, timestamp: new Date().toISOString() };
      setMessages((prev) => {
        const newMessages = [...prev, botResponse];
        localStorage.setItem(
          "chatMessages",
          JSON.stringify(
            newMessages.map((msg) => ({
              text: msg.text,
              sender: msg.sender,
              imageSrc: msg.imageSrc,
              timestamp: msg.timestamp,
            }))
          )
        );
        const newMessageIndex = newMessages.length - 1;
        speak(botResponseText, newMessageIndex, moodLabel);
        return newMessages;
      });
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message to /analyze:", error);
      const errorMessage =
        "I’m sorry, something went wrong while communicating with the server. I’m still here for you—let’s try again. What’s on your mind?";
      const botResponse = {
        text: errorMessage,
        sender: "bot",
        moodLabel: "Neutral 🙂",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => {
        const newMessages = [...prev, botResponse];
        localStorage.setItem(
          "chatMessages",
          JSON.stringify(
            newMessages.map((msg) => ({
              text: msg.text,
              sender: msg.sender,
              imageSrc: msg.imageSrc,
              timestamp: msg.timestamp,
            }))
          )
        );
        const newMessageIndex = newMessages.length - 1;
        speak(errorMessage, newMessageIndex, "Neutral 🙂");
        return newMessages;
      });
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    const timeGreeting = getTimeBasedGreeting();
    setTimeGreetingWithName(`${timeGreeting}${userName ? `, ${userName}` : ""}.`);
    setMessages([]);
    localStorage.removeItem("chatMessages");
    window.speechSynthesis.cancel();
    setCurrentTTSMessageIndex(null);
    setIsTTSPaused(false);

    const accessToken = localStorage.getItem("token");
    if (sessionId && accessToken) {
      try {
        await axios.delete(`http://localhost:5000/clear_chats/${sessionId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (error) {
        console.error("Error clearing chat history:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.trim().length > 0);
  };

  const handleNavigateToSelfHelp = () => {
    const latestMood = localStorage.getItem("latestMood") || "Neutral 🙂";
    const selfHelpResource = JSON.parse(localStorage.getItem("selfHelpResource")) || [];
    navigate("/self-help", { state: { latestMood, selfHelpResource } });
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("token");
    await endSession(sessionId, accessToken);
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("latestMood");
    localStorage.removeItem("selfHelpResource");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    window.speechSynthesis.cancel(); // Reset speech synthesis
    setCurrentTTSMessageIndex(null);
    setIsTTSPaused(false);
  };

  return (
    <div className="chat-container">
      <nav className={`navbar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="navbar-content">
          <div className="navbar-header">
            <button
              onClick={toggleSidebar}
              className="toggle-btn"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <FaBars />
            </button>
            {isSidebarOpen && <h1 className="navbar-title">MindEase</h1>}
          </div>
          <div className="navbar-links">
            <button
              onClick={() => navigate("/profile")}
              className="nav-link profile-btn"
              aria-label="View Profile"
            >
              <FaUser className="nav-icon" />
              {isSidebarOpen && <span>Profile</span>}
            </button>
         <button
         onClick={() => navigate("/mood-history")}
         className="nav-link mood-history-btn"
         aria-label="Mood History"
        >
        <BiLineChart className="nav-icon" />  {/* <-- replaced icon here */}
        {isSidebarOpen && <span>Mood History</span>}
        </button>
            <button
              onClick={() => navigate("/chat-history")}
              className="nav-link chat-history-btn"
              aria-label="Chat History"
            >
              <FaHistory className="nav-icon" />
              {isSidebarOpen && <span>Chat History</span>}
            </button>
             <button
             onClick={() => navigate("/quizzes")}
             className="nav-link quizzes-btn"
             aria-label="Go to quizzes"
             >
            <FaQuestionCircle className="nav-icon" />
            {isSidebarOpen && <span>Quiz</span>}
            </button>

             <button
              onClick={() => navigate("/mini-games")} // Added Mini-Games button
              className="nav-link mini-games-btn"
              aria-label="Play Mini-Games"
            >
              <FaGamepad className="nav-icon" />
              {isSidebarOpen && <span>Mini-Games</span>}
            </button>
            
            <button
              onClick={handleNavigateToSelfHelp}
              className="nav-link self-help-btn"
              disabled={!localStorage.getItem("latestMood")}
              aria-label="Self-Help Resources"
            >
              <FaBook className="nav-icon" />
              {isSidebarOpen && <span>Self-Help</span>}
            </button>
            <button
              onClick={handleLogout}
              className="nav-link logout-btn"
              aria-label="Logout"
            >
              <FaSignOutAlt className="nav-icon" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </nav>

      <section ref={chatRef} className="chat-section">
        <motion.div
          initial="hidden"
          animate={chatInView ? "visible" : "hidden"}
          variants={chatVariants}
          className="chat-card"
        >
          <h4 className="chat-greeting">{timeGreetingWithName}</h4>
          <p className="chat-help-text">How can I help you today?</p>
          <div className="language-selector">
            <label htmlFor="language-select">Select Language:</label>
            <select id="language-select" value={language} onChange={handleLanguageChange}>
              <option value="en-US">English</option>
              <option value="ml-IN">Malayalam</option>
            </select>
          </div>
          {isLoading && (
            <div className="loading-spinner">
              <FaSpinner className="spinner-icon" />
            </div>
          )}
          <div className="chat-box" ref={chatBoxRef}>
            {groupMessagesByDate().map((item) => {
              if (item.type === "date") {
                return (
                  <div key={item.id} className="date-label">
                    {formatDateLabel(item.date)}
                  </div>
                );
              } else {
                const msg = item.data;
                const index = item.id;
                return (
                  <div
                    key={index}
                    className={`chat-message ${msg.sender}-message animate__animated ${
                      msg.sender === "bot" ? "animate__fadeInLeft" : "animate__fadeInRight"
                    }`}
                  >
                    <div className="message-wrapper">
                      <div className={`avatar ${msg.sender}-avatar`}>{msg.sender === "user" ? "👤" : "🤖"}</div>
                      <div className="message-content">
                        <div className="message-text">{msg.text}</div>
                        <span className="message-timestamp">{formatTimestamp(msg.timestamp)}</span>
                        {msg.sender === "bot" && (
                          <button
                            onClick={() =>
                              speak(msg.text, index, msg.moodLabel || localStorage.getItem("latestMood") || "Neutral 🙂")
                            }
                            className="speak-btn"
                            title={currentTTSMessageIndex === index && !isTTSPaused ? "Pause" : "Play"}
                            aria-label={
                              currentTTSMessageIndex === index && !isTTSPaused ? "Pause speech" : "Play speech"
                            }
                          >
                            {currentTTSMessageIndex === index && !isTTSPaused ? <FaPause /> : <FaVolumeUp />}
                          </button>
                        )}
                      </div>
                    </div>
                    {msg.audioBlob && typeof msg.audioBlob === "object" && msg.audioBlob instanceof Blob ? (
                      <audio controls className="audio-player">
                        <source src={URL.createObjectURL(msg.audioBlob)} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : msg.isAudio && msg.transcribedText ? (
                      <p className="text-gray-500 italic">
                        {msg.text.includes("transcription failed")
                          ? "Audio message (transcription unavailable)"
                          : `Transcribed: ${msg.transcribedText}`}
                      </p>
                    ) : null}
                    {msg.imageSrc && <img src={msg.imageSrc} alt="Captured" className="chat-image" />}
                  </div>
                );
              }
            })}
            {isTyping && <div className="typing-indicator">Typing...</div>}
          </div>
          <div className="input-area">
            <div className="message-input-wrapper">
              <button onClick={handleClearChat} className="custom-clear-btn" aria-label="Clear chat">
                <FaTrash />
              </button>
              <div className="input-container">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="message-input"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  aria-label="Message input"
                />
                {!isTyping && (
                  <>
                    <button
                      onClick={() => alert("Open Camera")}
                      className="input-action-btn camera-btn"
                      aria-label="Open camera"
                    >
                      <FaCamera />
                    </button>
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`input-action-btn record-btn ${isRecording ? "recording" : ""}`}
                      aria-label={isRecording ? "Stop recording" : "Start recording"}
                    >
                      <FaMicrophone />
                    </button>
                  </>
                )}
              </div>
              {isTyping && (
                <button onClick={() => sendMessage(input)} className="custom-send-btn" aria-label="Send message">
                  <FaPaperPlane />
                </button>
              )}
              {isRecording && (
                <span className="recording-timer text-red-500">
                  Recording: {formatRecordingTime(recordingTime)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Chat;
