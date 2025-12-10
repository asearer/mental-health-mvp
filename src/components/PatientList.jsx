// src/components/PatientList.js
import React from "react";
import "./PatientList.css"; // Ensure you import the CSS file

const PatientList = ({ patients, onViewDetails, onViewNotes }) => {
  const handleViewDetails = (id) => {
    if (onViewDetails) {
      onViewDetails(id); // Call the passed function to view details
    }
  };

  const handleViewNotes = (id) => {
    if (onViewNotes) {
      onViewNotes(id); // Call the passed function to view notes
    }
  };

  return (
    <div className="patient-list">
      {patients.map((patient) => (
        <div className="patient-item" key={patient.id}>
          <h3 style={{ margin: 0 }}>{patient.name}</h3>
          <div className="button-container">
            <button className="button" onClick={() => handleViewDetails(patient.id)}>
              View Details
            </button>
            <button className="button" onClick={() => handleViewNotes(patient.id)}>
              View Notes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
