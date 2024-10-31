// src/components/NoteForm.js

import React, { useState } from "react";
import axios from "axios";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css"; // Optional: basic Draft.js styling

const NoteForm = ({ patientId }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [diagnosis, setDiagnosis] = useState("");

  // Convert content to plain text for sending to backend
  const getContentText = () => editorState.getCurrentContent().getPlainText();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await axios.post(
      `http://localhost:8000/api/patients/${patientId}/notes`,
      { note_text: getContentText(), diagnosis }, // Note text in plain form
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEditorState(EditorState.createEmpty()); // Reset the editor after submission
    setDiagnosis("");
  };

  // Handle editor state change
  const onEditorChange = (newState) => setEditorState(newState);

  // Custom formatting options (bold, italic, underline)
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Format buttons to apply styles
  const applyStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <div>
      <h4>Add Note</h4>
      <form onSubmit={handleSubmit}>
        <div style={{ border: "1px solid #ccc", minHeight: "200px", padding: "10px" }}>
          <Editor
            editorState={editorState}
            onChange={onEditorChange}
            handleKeyCommand={handleKeyCommand}
            placeholder="Enter note..."
          />
        </div>
        <div>
          <button type="button" onClick={() => applyStyle("BOLD")}>Bold</button>
          <button type="button" onClick={() => applyStyle("ITALIC")}>Italic</button>
          <button type="button" onClick={() => applyStyle("UNDERLINE")}>Underline</button>
        </div>
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
