import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
//import Login from "./components/Login"; // Keep commented out if skipping
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import PatientDetail from "./components/PatientDetail";
import './App.css';

// A simple NotFound component for unmatched routes
const NotFound = () => <h2>404 - Page Not Found</h2>;

// Flag to detect development mode
const isDev = import.meta.env.MODE === "development";

const App = () => {
    return (
        <Router>
            <>
                <Navbar /> {/* Add Navbar here */}
                <main>
                    <Routes>
                        {/* Conditionally render login route */}
                        {!isDev && <Route path="/login" element={<Login />} />}

                        {/* Dashboard route */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* PatientDetail route */}
                        <Route path="/patients/:id" element={<PatientDetail />} />

                        {/* Root route: skip login in dev */}
                        <Route
                            path="/"
                            element={isDev ? <Navigate to="/dashboard" replace /> : <Login />}
                        />

                        {/* Catch-all route for 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </>
        </Router>
    );
};

export default App;






