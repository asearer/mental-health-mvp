// src/components/NoteForm.js
import React, { useState } from "react";
import axios from "axios";

const NoteForm = ({ patientId }) => {
  const [noteText, setNoteText] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:8000/api/patients/${patientId}/notes`,
      { note_text: noteText, diagnosis },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNoteText("");
    setDiagnosis("");
  };

  return (
    <div>
      <h4>Add Note</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default NoteForm;
