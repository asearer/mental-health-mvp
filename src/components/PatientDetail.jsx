import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PatientDetail.css';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');

  const fetchPatient = async (id) => {
    if (!id) {
      setError('No patient ID provided.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/patients/${id}`);
      setPatient(response.data);
    } catch (error) {
      setError('Error fetching patient details');
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (newNote.trim() === '') {
      setError('Note cannot be empty');
      return;
    }

    try {
      await axios.post(`http://localhost:8000/api/patients/${id}/notes`, { note: newNote });
      fetchPatient(id); // Refresh the patient data after submitting the note
      setNewNote(''); // Clear the input field
      setError('');
    } catch (error) {
      setError('Error saving note');
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    } else {
      setError('Patient ID is not valid');
    }
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-detail-container">
      <h2>{patient.name}</h2>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Contact Info:</strong> {patient.contact.phone}, {patient.contact.email}</p>
      <p><strong>Medical Info:</strong> {patient.info}</p>
      <p><strong>Emergency Contact:</strong> {patient.contact.emergencyContact}</p>

      <h3>Medical History</h3>
      <ul>
        {patient.medicalHistory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Therapy Notes</h3>
      {patient.therapyNotes.length > 0 ? (
        <ul>
          {patient.therapyNotes.map((note, index) => (
            <li key={index}>
              <strong>Date:</strong> {note.date} <br />
              <strong>Counselor:</strong> {note.counselor} <br />
              <strong>Note:</strong> {note.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available for this patient.</p>
      )}

      <form onSubmit={handleNoteSubmit}>
        <h3>Add a New Note</h3>
        {error && <p className="error">{error}</p>}
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a new therapy note"
        />
        <button type="submit">Save Note</button>
      </form>
    </div>
  );
};

export default PatientDetail;




















