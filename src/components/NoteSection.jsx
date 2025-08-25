import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg"; // Import from react-draft-wysiwyg
import { EditorState, convertToRaw } from "draft-js"; // Still need draft-js for handling the editor state
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // Import the editor's CSS styles

const NoteSection = ({ patient }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    // Function to handle note changes
    const handleNoteChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const saveNotes = async () => {
        // Convert content to raw JSON to store it more easily
        const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        
        try {
            const response = await fetch("http://localhost:8000/api/saveNotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: patient.id, notes: rawContent }), // Save only raw content
            });
            if (!response.ok) {
                throw new Error("Failed to save notes");
            }
            alert("Notes saved successfully!");
        } catch (error) {
            alert(`Error saving notes: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Notes for {patient.name}</h2>
            <div style={{ border: "1px solid #ddd", padding: "10px", minHeight: "200px" }}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={handleNoteChange} // Change event handler
                    toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'], // Customize the toolbar options
                    }}
                    placeholder="Add your notes here..."
                />
            </div>
            <button onClick={saveNotes} style={{ marginTop: "10px" }}>Save Notes</button>
        </div>
    );
};

export default NoteSection;







