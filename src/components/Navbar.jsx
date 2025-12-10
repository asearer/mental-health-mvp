// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file for styling

const Navbar = () => {
  const handleLogout = () => {
    // Add your logout logic here, such as clearing user data and redirecting
    console.log("User logged out");
    // Example: Redirect to the login page after logout
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Health App
        </Link>
        <ul className="navbar-menu">
          <li>
            <button onClick={handleLogout} className="navbar-item logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
