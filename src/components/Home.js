import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Import the image
import heroImage from "../assets/mental-wellness-hero.jpg"; // Adjust the path based on your image location

// Animation variants for the hero section
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const circleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.4 },
  },
};

// Animation variants for feature cards, benefits, and about section
const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const benefitVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const aboutVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Home = () => {
  // UseInView hooks for scroll-based animations
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div>
      {/* Hero Section with Animation */}
      <section className="flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white min-h-screen">
        <motion.div
          className="md:w-1/2"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <motion.h1
            className="text-5xl font-bold mb-4 leading-tight"
            variants={heroVariants}
          >
            AI-Powered Mental Health Companion
          </motion.h1>
          <motion.p
            className="text-lg mb-6 text-gray-300"
            variants={heroVariants}
          >
            MindEase offers 24/7 emotional support, mood tracking, and personalized self-help resources using advanced AI, facial recognition, and voice interaction.
          </motion.p>
          <motion.div variants={heroVariants} className="flex flex-col items-start gap-3">
            <Link
              to="/login"
              className="bg-green-500 text-white px-6 py-1.5 rounded flex items-center justify-center gap-2 hover:bg-green-600 transition duration-300 transform hover:scale-105 text-sm w-48"
            >
              Get Started
              <span className="text-sm">→</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:text-green-500">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          className="md:w-1/2 mt-6 md:mt-0"
          initial="hidden"
          animate="visible"
          variants={circleVariants}
        >
          {/* Replace the circular element with an image */}
          <img
            src={heroImage}
            alt="Mental Wellness Illustration"
            className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-lg mx-auto shadow-lg"
          />
        
        </motion.div>
      </section>

      {/* Features Section with Scroll Animation */}
      <section ref={featuresRef} className="p-8 bg-gray-800 text-white">
        <motion.h2
          className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Features of MindEase
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🤖",
              title: "AI-Powered Chatbot",
              description: "Engage in human-like conversations with an AI that understands your emotions using NLP and GPT-based models.",
            },
            {
              icon: "😊",
              title: "Facial Recognition",
              description: "Detects emotions from facial expressions to provide mood-based support in real-time.",
            },
            {
              icon: "📊",
              title: "Mood Tracking",
              description: "Logs emotional trends over time to help you monitor your mental well-being.",
            },
            {
              icon: "🎙️",
              title: "Voice Interaction",
              description: "Communicate through speech with Speech-to-Text and Text-to-Speech support.",
            },
            {
              icon: "🚨",
              title: "Emergency Alerts",
              description: "Detects distress signals in speech and sends alerts to emergency contacts.",
            },
            {
              icon: "🧘",
              title: "Self-Help Resources",
              description: "Access meditation techniques, therapy exercises, and motivational content tailored to your needs.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              custom={index}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={cardVariants}
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-2">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-green-400">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section with Scroll Animation */}
      <section ref={benefitsRef} className="p-8 bg-gray-900 text-white">
        <motion.h2
          className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Why Choose MindEase?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: "⏰",
              title: "24/7 Accessibility",
              description: "Always available to provide instant support, no matter where you are or what time it is.",
            },
            {
              icon: "🎯",
              title: "Personalized Support",
              description: "Custom responses based on your mood, detected through facial expressions and sentiment analysis.",
            },
            {
              icon: "🔒",
              title: "Privacy & Confidentiality",
              description: "Anonymous interactions with secure data encryption to protect your privacy.",
            },
            {
              icon: "🆘",
              title: "Emergency Support",
              description: "Detects distress signals and sends alerts to emergency contacts when needed.",
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-start"
              custom={index}
              initial="hidden"
              animate={benefitsInView ? "visible" : "hidden"}
              variants={benefitVariants}
            >
              <span className="text-3xl mr-4">{benefit.icon}</span>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-green-400">
                  {benefit.title}
                </h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us Section Matching the Screenshot */}
      <section ref={aboutRef} className="p-8 bg-gray-800 text-white">
        <motion.h2
          className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          About MindEase
        </motion.h2>
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-gray-700 p-6 rounded-xl shadow-md"
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            variants={aboutVariants}
          >
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🌟</span>
              <h3 className="text-xl font-semibold text-green-400">
                Who We Are
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              MindEase is an AI-powered mental health chatbot designed to provide 24/7 emotional support, mood tracking, and personalized self-help resources. We’re here to help you navigate your mental health journey with compassion and innovation.
            </p>
            <Link
              to="/about"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
              aria-label="Learn more about MindEase"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;