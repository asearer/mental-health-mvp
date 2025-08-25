// src/index.jsx (or main.jsx)

// 1️⃣ Polyfill global first
if (typeof global === "undefined") {
    window.global = window;
}

// 2️⃣ Then import everything else
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)


