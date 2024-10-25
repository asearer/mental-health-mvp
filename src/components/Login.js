// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Hardcoded credentials
  const hardcodedCredentials = {
    username: "testuser",
    password: "password123",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if credentials match
    if (
      username === hardcodedCredentials.username &&
      password === hardcodedCredentials.password
    ) {
      // Redirect to Dashboard on successful login
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Login</h1>
      </header>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;



