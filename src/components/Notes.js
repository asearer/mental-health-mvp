import React, { useState, useEffect } from 'react';

const Notes = ({ patientId }) => {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');

  // Load previously saved notes from the API
  useEffect(() => {
    const fetchSavedNotes = async () => {
      try {
        const response = await fetch(`/api/patients/${patientId}`); // Fetch patient data including notes if available
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const patientData = await response.json();
        // Assuming that patient data may have a notes field
        setSavedNotes(patientData.notes || ''); // Set notes if available
        setNotes(patientData.notes || ''); // Initialize notes state
      } catch (error) {
        console.error('Error fetching saved notes:', error);
      }
    };

    fetchSavedNotes();
  }, [patientId]);

  const handleSave = async () => {
    try {
      console.log("Saving notes:", notes);
      const response = await fetch('/api/saveNotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [patientId]: notes }), // Save the notes with patient ID as key
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setSavedNotes(notes); // Update savedNotes state to show saved notes
      alert('Notes saved successfully!');
    } catch (error) {
      alert(`Error saving notes: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter patient notes here..."
      />
      <button onClick={handleSave}>Save Notes</button>

      {savedNotes && (
        <div>
          <h3>Saved Notes:</h3>
          <p>{savedNotes}</p>
        </div>
      )}
    </div>
  );
};

export default Notes;

