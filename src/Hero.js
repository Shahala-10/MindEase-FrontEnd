import React from "react";
import HeroImage from "../assets/hero-image.png"; // Add your image in src/assets

const Hero = () => {
  return (
    <div className="bg-[#0E1625] h-screen flex items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="text-white text-center md:text-left md:w-1/2">
          <h1 className="text-5xl font-bold mb-4">
            Start Your Journey to <span className="text-green-500">Mental Wellness</span>
          </h1>
          <p className="text-lg mb-6">
            We lower our stress levels, we get to know our pain, and we connect better.
            Let us walk you through mindful meditation.
          </p>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
            Get Started
          </button>
        </div>
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
          <img src={HeroImage} alt="Hero" className="w-96 h-auto rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
