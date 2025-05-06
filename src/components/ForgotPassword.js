import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Helper to extract query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ForgotPassword = () => {
  const query = useQuery();
  const token = query.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  // Handle "Forgot Password" form
  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
      });
      setMessage(res.data.message || "Reset link sent to your email.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle "Reset Password" form
  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/reset-password", {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword, // Match backend expectation
      });
      setMessage(res.data.message || "Password reset successful.");
      // Optionally redirect to login after success
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4 text-white">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          {token ? "Reset Your Password 🔐" : "Forgot Your Password? 🔒"}
        </h2>

        {message && (
          <p className="text-center text-sm text-green-400 mb-3">{message}</p>
        )}
        {error && (
          <p className="text-center text-sm text-red-400 mb-3">{error}</p>
        )}

        {!token ? (
          // Forgot Password Form
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-300"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          // Reset Password Form
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-gray-300 mb-1">
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition duration-300"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
            Back to Login
          </Link>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2025 MindEase. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;