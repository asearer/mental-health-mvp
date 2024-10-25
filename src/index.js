// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Update for React 18
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // Create a root

root.render(
  <React.StrictMode>
    <App />  {/* No need for BrowserRouter here */}
  </React.StrictMode>
);
