import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SelfHelp.css";

const SelfHelp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { latestMood, selfHelpResource = [] } = location.state || {};
  const mood = latestMood || "Neutral 🙂";

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) navigate("/login");
  }, [navigate]);

  // Use backend-provided selfHelpResource, default to empty array if invalid
  const resources = Array.isArray(selfHelpResource) ? selfHelpResource : [{ title: "No resources available at the moment.", link: "#" }];
  console.log("Latest Mood:", mood, "Resources:", resources);

  if (!resources || resources.length === 0) {
    return <div className="self-help-container">Error: No resources available or invalid data.</div>;
  }

  return (
    <div className="self-help-container">
      <h2 className="self-help-title">Self-Help Resources</h2>
      <p className="self-help-subtitle">Explore tips tailored to your mood ({mood}):</p>
      <div className="resource-list">
        {resources.map((tip, index) => (
          <div key={index} className="resource-item">
            {tip.link ? (
              <a href={tip.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                {tip.title}
              </a>
            ) : (
              <span className="resource-text">{tip.title}</span>
            )}
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => navigate("/chat")}>
        Back to Chat
      </button>
    </div>
  );
};

export default SelfHelp;