import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar"; // Import the Navbar component
import PatientDetail from "./components/PatientDetail"; // Import the PatientDetail component
import './App.css';

// A simple NotFound component for unmatched routes
const NotFound = () => <h2>404 - Page Not Found</h2>;

const App = () => {
  return (
    <Router>
      <>
        <Navbar /> {/* Add Navbar here */}
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add the PatientDetail route with :id */}
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/" element={<Login />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </>
    </Router>
  );
};

export default App;





