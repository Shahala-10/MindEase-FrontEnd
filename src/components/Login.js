import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate();
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/chat');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: formData.email,
        password: formData.password,
      });

      const result = response.data;

      // Save token and user ID to localStorage
      localStorage.setItem("token", result.data.access_token);
      localStorage.setItem("userId", result.data.user_id);

      console.log("✅ Login success:", result);
      navigate("/chat");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <section ref={formRef} className="p-8 flex items-center justify-center min-h-screen">
        <motion.div
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          variants={formVariants}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
              Welcome to MindEase 💙
            </h2>
            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your email"
                  required
                  autoFocus // Automatically focus on the email input
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Password:
                </label>
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
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading} // Disable button when loading
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="text-center text-gray-400 text-sm mt-2">
                Forgot Password?{" "}
                <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                  Click here
                </Link>
              </p>
              <p className="text-center text-gray-400 text-sm">
                New here?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Login;
