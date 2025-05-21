import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";

// Animation variants for the hero section
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Contact = () => {
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [infoRef, infoInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [feedbackRef, feedbackInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const handleChange = (e) => {
    setFeedbackData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFeedbackData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackStatus(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/submit_feedback", feedbackData);
      if (response.data.status === "success") {
        setFeedbackStatus("Feedback sent successfully!");
        setFeedbackData({ name: "", email: "", message: "", rating: 0 });
      } else {
        setError(response.data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-center min-h-screen flex flex-col justify-center"
      >
        <motion.div
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={heroVariants}
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            variants={heroVariants}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
            variants={heroVariants}
          >
            We’re here to help! Reach out to us with any questions, feedback, or support requests.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Information Section */}
      <section ref={infoRef} className="p-8 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={infoInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            Get in Touch
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              variants={sectionVariants}
            >
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                Email Us
              </h3>
              <p className="text-gray-300 mb-4">
                For general inquiries or support, email us at:
              </p>
              <a
                href="mailto:support@mindease.com"
                className="text-green-400 font-semibold hover:text-green-500 transition duration-300"
              >
                support@mindease.com
              </a>
            </motion.div>
            <motion.div
              className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              variants={sectionVariants}
            >
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                Call Us
              </h3>
              <p className="text-gray-300 mb-4">
                Reach out to us directly via phone:
              </p>
              <a
                href="tel:+1234567890"
                className="text-green-400 font-semibold hover:text-green-500 transition duration-300"
              >
                +1 (234) 567-890
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section ref={feedbackRef} className="p-8 bg-gray-800">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={feedbackInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            Share Your Feedback
          </motion.h2>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-gray-700 p-6 rounded-lg shadow-lg"
            initial="hidden"
            animate={feedbackInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            {feedbackStatus && (
              <p className="text-center text-green-400 mb-4">{feedbackStatus}</p>
            )}
            {error && (
              <p className="text-center text-red-400 mb-4">{error}</p>
            )}
            <div className="mb-4">
              <label htmlFor="feedback-name" className="block text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="feedback-name"
                name="name"
                value={feedbackData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-green-400"
                placeholder="Your Name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="feedback-email" className="block text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="feedback-email"
                name="email"
                value={feedbackData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-green-400"
                placeholder="Your Email"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="feedback-message" className="block text-gray-300 mb-2">
                Feedback
              </label>
              <textarea
                id="feedback-message"
                name="message"
                value={feedbackData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-green-400"
                rows="5"
                placeholder="Share your thoughts or suggestions..."
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-300 mb-2">
                Rate Your Experience (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => !isSubmitting && handleRatingChange(star)}
                    className={`cursor-pointer text-2xl ${star <= feedbackData.rating ? "text-yellow-400" : "text-gray-500"} ${isSubmitting ? "cursor-not-allowed" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className={`w-full bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Call to Action Section */}
      <section ref={ctaRef} className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-4 text-white"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          Explore More
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl text-gray-300 mb-6"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          Check out our resources or return to the homepage to learn more about MindEase.
        </motion.p>
        <motion.div
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <Link
            to="/resources"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition duration-300 mr-4"
          >
            View Resources
          </Link>
          <Link
            to="/"
            className="inline-block bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition duration-300"
          >
            Back to Home
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;