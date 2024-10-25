// src/components/NoteSection.js
import React, { useState } from 'react';
import './NoteSection.css';

const NoteSection = ({ patient }) => {
    // Initialize state to hold notes for the selected patient
    const [notes, setNotes] = useState('');

    // Handle note change for the selected patient
    const handleNoteChange = (newNote) => {
        setNotes(newNote);
    };

    // Function to save notes to the server
    const saveNotes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/saveNotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: patient.id, notes }), // Include patient ID with notes
            });
            if (!response.ok) {
                throw new Error('Failed to save notes');
            }
            alert('Notes saved successfully!');
        } catch (error) {
            alert(`Error saving notes: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Notes for {patient.name}</h2>
            <textarea
                value={notes}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Add your notes here..."
            />
            <button onClick={saveNotes}>Save Notes</button>
        </div>
    );
};

export default NoteSection;



