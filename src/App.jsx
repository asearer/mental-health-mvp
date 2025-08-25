import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./components/Login"; // Temporarily disabled
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import PatientDetail from "./components/PatientDetail";
import './App.css';

// 404 component
const NotFound = () => <h2>404 - Page Not Found</h2>;

const App = () => {
    return (
        <Router>
            <>
                <Navbar /> {/* Always show Navbar */}
                <main>
                    <Routes>
                        {/* Dashboard route */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* PatientDetail route */}
                        <Route path="/patients/:id" element={<PatientDetail />} />

                        {/* Login route temporarily disabled */}
                        {/* <Route path="/login" element={<Login />} /> */}

                        {/* Catch-all 404 route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </>
        </Router>
    );
};

export default App;

