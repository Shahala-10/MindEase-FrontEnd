import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";

// Animation variants for the form section
const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.phoneNumber
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      
      // ✅ FIXED: Extract directly from response.data
      const { access_token, user_id } = response.data.data;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user_id);

      console.log("Registration successful:", response.data);
      navigate("/chat");

    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center relative">
      {/* Mini Heading Instead of Navbar */}
      <div className="absolute top-4 left-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        MindEase
      </div>

      {/* Signup Form Section */}
      <section ref={formRef} className="mt-20 p-8 flex items-center justify-center min-h-screen">
        <motion.div
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          variants={formVariants}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
              Create Your MindEase Account 💙
            </h2>
            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-gray-300 mb-2">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-2">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-gray-300 mb-2">Date of Birth:</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-gray-300 mb-2">Gender:</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                >
                  <option value="" disabled>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-300 mb-2">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
              >
                Register
              </button>
              <p className="text-center text-gray-400 text-sm mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Signup;
