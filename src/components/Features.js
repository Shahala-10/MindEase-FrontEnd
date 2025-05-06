import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants (same as Home.js)
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

const Features = () => {
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div>
      {/* Features Section with Scroll Animation */}
      <section
        ref={featuresRef}
        className="p-8 bg-gray-800 text-white"
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Key Features of MindEase
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
      <section
        ref={benefitsRef}
        className="p-8 bg-gray-900 text-white"
      >
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
    </div>
  );
};

export default Features;