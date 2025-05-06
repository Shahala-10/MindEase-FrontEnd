import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const Resources = () => {
  const [selfHelpRef, selfHelpInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [externalLinksRef, externalLinksInView] = useInView({ triggerOnce: true, threshold: 0.2 });
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
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            variants={heroVariants}
          >
            Mental Health Resources
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
            variants={heroVariants}
          >
            Explore a variety of tools, exercises, and external resources to support your mental well-being. MindEase is here to help you every step of the way.
          </motion.p>
        </motion.div>
      </section>

      {/* Self-Help Resources Section */}
      <section ref={selfHelpRef} className="p-8 bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={selfHelpInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            Self-Help Resources
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧘",
                title: "Guided Meditation",
                description: "Find peace and calmness through simple meditation exercises.",
              },
              {
                icon: "🌬️",
                title: "Breathing Exercises",
                description: "Learn breathing techniques to reduce anxiety and improve focus.",
              },
              {
                icon: "📝",
                title: "Journaling Prompts",
                description: "Reflect on your emotions and thoughts through daily writing prompts.",
              },
            ].map((resource, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                custom={index}
                initial="hidden"
                animate={selfHelpInView ? "visible" : "hidden"}
                variants={cardVariants}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-2">{resource.icon}</span>
                  <h3 className="text-xl font-semibold text-green-400">
                    {resource.title}
                  </h3>
                </div>
                <p className="text-gray-300">{resource.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* External Links Section */}
      <section ref={externalLinksRef} className="p-8 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            initial="hidden"
            animate={externalLinksInView ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            External Resources
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "National Alliance on Mental Illness (NAMI)",
                description: "Access educational resources, support groups, and helplines for mental health support.",
                link: "https://www.nami.org",
              },
              {
                title: "Mental Health America (MHA)",
                description: "Find tools, screenings, and information to improve your mental well-being.",
                link: "https://www.mhanational.org",
              },
              {
                title: "Crisis Text Line",
                description: "Text HOME to 741741 to connect with a crisis counselor 24/7.",
                link: "https://www.crisistextline.org",
              },
              {
                title: "World Health Organization (WHO) - Mental Health",
                description: "Learn about global mental health initiatives and resources.",
                link: "https://www.who.int/health-topics/mental-health",
              },
            ].map((resource, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                custom={index}
                initial="hidden"
                animate={externalLinksInView ? "visible" : "hidden"}
                variants={cardVariants}
              >
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-300 mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-green-400 font-semibold hover:text-green-500 transition duration-300"
                >
                  Visit Website
                </a>
              </motion.div>
            ))}
          </div>
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
          Ready to Take the Next Step?
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl text-gray-300 mb-6"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          Sign up today to access personalized mental health support with MindEase.
        </motion.p>
        <motion.div
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <Link
            to="/login"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Resources;
