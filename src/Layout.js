import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">MindEase</h1>
          <div className="navbar-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/features" className="nav-link">Features</a>
            <button className="nav-link logout-btn" onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}>
              Logout
            </button>
            <a href="/profile" className="nav-link profile-btn">View Profile</a>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      {/* Only show footer if not on the Chat page */}
      {location.pathname !== "/chat" && (
        <footer className="footer">
          <p>© 2025 MindEase. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default Layout;
