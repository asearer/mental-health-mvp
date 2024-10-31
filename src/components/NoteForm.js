import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill"; // Import react-quill
import "react-quill/dist/quill.snow.css"; // Import the Quill styles

const NoteForm = ({ patientId }) => {
  const [noteText, setNoteText] = useState(""); // This will hold the note content
  const [diagnosis, setDiagnosis] = useState(""); // This will hold the diagnosis

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:8000/api/patients/${patientId}/notes`,
      { note_text: noteText, diagnosis }, // Send the note text and diagnosis
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNoteText(""); // Reset note text after submission
    setDiagnosis(""); // Reset diagnosis after submission
  };

  // Custom modules for the Quill editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      ['clean'], // Remove formatting button
    ],
  };

  return (
    <div>
      <h4>Add Note</h4>
      <form onSubmit={handleSubmit}>
        <ReactQuill
          modules={modules} // Apply the custom modules
          placeholder="Enter note" // Placeholder text for the editor
          value={noteText} // Bind the editor's value to the state
          onChange={setNoteText} // Update the state on change
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
