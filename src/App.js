import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import EmergencyContacts from "./components/EmergencyContacts"; // Import the EmergencyContacts component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const AppContent = () => {
  const location = useLocation();
  console.log("Current location:", location.pathname); // Debug log

  // Updated paths to include /emergency-contacts where Navbar and Footer should be hidden
  const hideNavbarFooterPaths = [
    "/signup",
    "/forgot-password",
    "/profile",
    "/chat",
    "/mood-history",
    "/self-help",
    "/emergency-contacts", // Add emergency contacts to the list
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

          {/* Protected Routes - Require authentication and at least 2 emergency contacts */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/self-help" element={<SelfHelp />} />
            <Route path="/mood-history" element={<MoodHistory />} />
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