import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

// Animation variants for cards and items
const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const About = () => {
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [setsApartRef, setsApartInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [techRef, techInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [privacyRef, privacyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-center min-h-screen flex flex-col justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <motion.h1
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            variants={heroVariants}
          >
            About MindEase
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            variants={heroVariants}
          >
            MindEase is an AI-powered mental health chatbot designed to provide 24/7 emotional support, mood tracking, and personalized self-help resources. We’re here to help you navigate your mental health journey with compassion and innovation.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission and Vision Section */}
      <section
        ref={missionRef}
        className="p-8 bg-gray-800"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            Our Mission & Vision
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Our Mission",
                description: "To provide accessible, 24/7 mental health support through advanced AI technology, empowering individuals to manage stress, anxiety, and depression with ease and privacy.",
              },
              {
                title: "Our Vision",
                description: "To create a world where everyone has the tools and support to improve their emotional well-being, fostering resilience and mental wellness through innovation.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 p-6 rounded-lg shadow-lg"
                custom={index}
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={cardVariants}
              >
                <h3 className="text-xl font-semibold mb-2 text-green-400">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section
        ref={setsApartRef}
        className="p-8 bg-gray-900"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={setsApartInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            What Sets Us Apart
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "Advanced AI Technology",
                description: "MindEase uses NLP, facial recognition, and voice interaction to deliver personalized support tailored to your emotional needs.",
              },
              {
                icon: "🚨",
                title: "Emergency Support",
                description: "Our emergency alert system detects distress signals and notifies contacts, ensuring you’re never alone in a crisis.",
              },
              {
                icon: "🔒",
                title: "Privacy First",
                description: "We prioritize your privacy with secure data encryption and anonymous interactions, so you can share freely.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start"
                custom={index}
                initial="hidden"
                animate={setsApartInView ? "visible" : "hidden"}
                variants={itemVariants}
              >
                <span className="text-3xl mr-4">{item.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-400">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Technology Section */}
      <section
        ref={techRef}
        className="p-8 bg-gray-800"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={techInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            Our Technology
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 mb-6"
            initial="hidden"
            animate={techInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            MindEase leverages cutting-edge AI technologies to provide a seamless and supportive experience. Our chatbot uses Natural Language Processing (NLP) and GPT-based models to understand and respond to your emotions. Facial recognition detects your mood through expressions, while sentiment analysis classifies your emotional tone. Voice interaction allows you to communicate hands-free, making support more accessible.
          </motion.p>
        </div>
      </section>

      {/* Privacy Commitment Section */}
      <section
        ref={privacyRef}
        className="p-8 bg-gray-900"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={privacyInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            Our Commitment to Privacy
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 mb-6"
            initial="hidden"
            animate={privacyInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            At MindEase, your privacy is our top priority. We use secure data encryption (Fernet, JWT) to protect your sensitive information. All interactions are anonymous, and there’s no human intervention—your conversations stay between you and our AI. We’re committed to providing a safe, judgment-free space for you to express your emotions.
          </motion.p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        ref={ctaRef}
        className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-center"
      >
        <motion.h2
          className="text-3xl font-bold mb-4 text-white"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          Ready to Start Your Journey?
        </motion.h2>
        <motion.p
          className="text-lg text-gray-300 mb-6"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          Join thousands of users who are improving their mental well-being with MindEase.
        </motion.p>
        <motion.div
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <Link
            to="/login" // Changed from /signup to /login
            className="bg-green-500 text-white px-6 py-1.5 rounded flex items-center justify-center gap-2 hover:bg-green-600 transition duration-300 transform hover:scale-105 text-sm w-48 mx-auto"
          >
            Get Started
            <span className="text-sm">→</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default About;