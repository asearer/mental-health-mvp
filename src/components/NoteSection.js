// src/components/NoteSection.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Import react-quill
import 'react-quill/dist/quill.snow.css'; // Import the Quill styles
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
            <ReactQuill
                value={notes} // Bind the editor's value to the state
                onChange={handleNoteChange} // Update the state on change
                placeholder="Add your notes here..." // Placeholder text for the editor
            />
            <button onClick={saveNotes}>Save Notes</button>
        </div>
    );
};

export default NoteSection;




