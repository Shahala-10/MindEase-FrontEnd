import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./components/Home";
import Chat from "./chat";
import Login from "./components/Login";
import Signup from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Resources from "./components/resources";
import Support from "./components/Support";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import About from "./components/About";
import SelfHelp from "./components/SelfHelp";
import MoodHistory from "./components/Moodhistory";
import EmergencyContacts from "./components/EmergencyContacts";
import ChatHistory from "./components/ChatHistory";
import QuizSection from "./components/QuizSection";
import MiniGames from "./components/MiniGames";
import MemoryMatchGame from "./components/MemoryMatchGame";
import ColorMatchGame from "./components/ColorMatchGame";
import WordScrambleGame from "./components/WordScrambleGame";
import MoodPuzzleGame from "./components/MoodPuzzleGame";
import HappyMomentsGame from "./components/HappyMomentsGame";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();
  console.log("📍 Current location:", location.pathname);

  const hideNavbarFooterPaths = [
    "/signup",
    "/forgot-password",
    "/profile",
    "/chat",
    "/mood-history",
    "/self-help",
    "/emergency-contacts",
    "/chat-history",
    "/quizzes",
    "/mini-games",
    "/memory-match-game",
    "/color-match-game",
    "/word-scramble-game",
    "/mood-puzzle-game",
    "/happy-moments-game",
    "/analyze-image",
  ];

  const hideNavbarFooter = hideNavbarFooterPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <div className={`min-h-screen bg-gray-900 font-sans ${!hideNavbarFooter ? "py-10" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/self-help" element={<SelfHelp />} />
            <Route path="/mood-history" element={<MoodHistory />} />
            <Route path="/chat-history" element={<ChatHistory />} />
            <Route path="/quizzes" element={<QuizSection />} />
            <Route path="/mini-games" element={<MiniGames />} />
            <Route path="/memory-match-game" element={<MemoryMatchGame />} />
            <Route path="/color-match-game" element={<ColorMatchGame />} />
            <Route path="/word-scramble-game" element={<WordScrambleGame />} />
            <Route path="/mood-puzzle-game" element={<MoodPuzzleGame />} />
            <Route path="/happy-moments-game" element={<HappyMomentsGame />} />
          </Route>
        </Routes>
      </div>
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
