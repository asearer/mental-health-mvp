// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import PatientList from "./PatientList";
import NoteSection from "./NoteSection";
import PatientDetail from "./PatientDetail"; // Import the PatientDetail component
import "./Dashboard.css"; // Ensure this CSS file contains the relevant styles

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null); // State to hold the selected patient for details
  const [selectedPatientNotes, setSelectedPatientNotes] = useState(null); // State to hold the selected patient for notes

  const fetchPatientData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/patients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setPatients(data); // Set the fetched patient data
    } catch (error) {
      setError(`Error fetching patient data: ${error.message}`); // Set error message
    } finally {
      setLoading(false); // Ensure loading is set to false in either case
    }
  };

  const handleViewDetails = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatient(patient);
    setSelectedPatientNotes(null); // Reset notes when viewing details
  };

  const handleViewNotes = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatientNotes(patient);
    setSelectedPatient(null); // Reset details when viewing notes
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Patient Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-content">
        <div className="patient-list-container">
          {!loading && !error && (
            <PatientList
              patients={patients}
              onViewDetails={handleViewDetails}
              onViewNotes={handleViewNotes}
            />
          )}
        </div>
        <div className="note-section-container">
          {selectedPatientNotes && <NoteSection patient={selectedPatientNotes} />}
        </div>
      </div>

      {/* Render patient details if a patient is selected for details */}
      {selectedPatient && (
        <div className="patient-detail-container">
          <PatientDetail patient={selectedPatient} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
