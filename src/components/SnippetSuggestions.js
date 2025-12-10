import React, { useState, useEffect } from "react";
import "./SnippetManager.css";

// Sample user for demonstration
const currentUser = { id: 1, name: "Practitioner A" }; // Replace with actual user info

const SnippetSuggestions = ({ query, snippets, onSelect }) => {
  // Filter snippets based on the query
  const filteredSnippets = snippets.filter((s) =>
    s.text.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="snippet-suggestions">
      {filteredSnippets.length > 0 ? (
        <ul>
          {filteredSnippets.map((s, index) => (
            <li key={index} onClick={() => onSelect(s.text)}>
              {s.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No suggestions found</p>
      )}
    </div>
  );
};

const SnippetManager = () => {
  const [snippets, setSnippets] = useState([
    {
      text: "Consider cognitive behavioral therapy for anxiety.",
      owner: currentUser.name,
      date: new Date().toISOString(),
      privacy: "public",
      notes: "Useful for patients with generalized anxiety disorder.",
    },
    {
      text: "Mindfulness techniques can reduce stress.",
      owner: currentUser.name,
      date: new Date().toISOString(),
      privacy: "public",
      notes: "Incorporate breathing exercises.",
    },
    {
      text: "Regular exercise can improve mental health.",
      owner: currentUser.name,
      date: new Date().toISOString(),
      privacy: "private",
      notes: "Encourage patients to find activities they enjoy.",
    },
  ]);
  const [snippet, setSnippet] = useState("");
  const [notes, setNotes] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [privacy, setPrivacy] = useState("private");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  // Handler to add or update a snippet
  const handleAddSnippet = () => {
    if (snippet.trim() === "") {
      alert("Snippet cannot be empty");
      return;
    }

    const newSnippet = {
      text: snippet,
      owner: currentUser.name,
      date: new Date().toISOString(),
      privacy,
      notes: notes.trim(),
    };

    if (editIndex !== null) {
      const updatedSnippets = snippets.map((s, index) => (index === editIndex ? newSnippet : s));
      setSnippets(updatedSnippets);
      setEditIndex(null);
    } else {
      setSnippets([...snippets, newSnippet]);
    }

    // Reset fields after adding
    setSnippet("");
    setNotes("");
    setPrivacy("private");
  };

  const handleEditSnippet = (index) => {
    const selectedSnippet = snippets[index];
    setSnippet(selectedSnippet.text);
    setNotes(selectedSnippet.notes);
    setPrivacy(selectedSnippet.privacy);
    setEditIndex(index);
  };

  const handleDeleteSnippet = (index) => {
    const updatedSnippets = snippets.filter((_, i) => i !== index);
    setSnippets(updatedSnippets);
    if (editIndex === index) {
      setEditIndex(null);
      setSnippet("");
      setNotes("");
      setPrivacy("private");
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      setSnippet(selectedText);
      setContextMenuVisible(true);
      setContextMenuPosition({ x: event.pageX, y: event.pageY });
    }
  };

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

  const insertSnippetIntoNotes = (text) => {
    setNotes((prevNotes) => `${prevNotes} ${text}`);
    closeContextMenu();
  };

  useEffect(() => {
    window.addEventListener("click", closeContextMenu);
    return () => {
      window.removeEventListener("click", closeContextMenu);
    };
  }, []);

  return (
    <div className="snippet-manager" onContextMenu={handleContextMenu}>
      <h2>Snippet Manager</h2>
      <div className="snippet-form">
        <input
          type="text"
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          placeholder="Enter your snippet here"
        />
        <label>
          Privacy:
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter notes for this snippet"
        />
        <button onClick={handleAddSnippet}>
          {editIndex !== null ? "Update Snippet" : "Add Snippet"}
        </button>
      </div>
      {/* Render SnippetSuggestions component */}
      {snippet && (
        <SnippetSuggestions
          query={snippet}
          snippets={snippets}
          onSelect={(selectedSnippet) => {
            setSnippet(selectedSnippet); // Update input with selected snippet
          }}
        />
      )}
      <ul className="snippet-list">
        {snippets
          .filter((s) => s.privacy === "public" || s.owner === currentUser.name)
          .map((s, index) => (
            <li key={index}>
              <span
                onClick={() => console.log(`Using snippet: ${s.text}`)}
                className="snippet-text"
              >
                {s.text} <span className="snippet-owner">by {s.owner}</span>
                {s.privacy === "public" && <span className="snippet-public"> (Public)</span>}
              </span>
              {s.notes && <div className="snippet-notes">Notes: {s.notes}</div>}
              {s.owner === currentUser.name ? (
                <>
                  <button onClick={() => handleEditSnippet(index)}>Edit</button>
                  <button onClick={() => handleDeleteSnippet(index)}>Delete</button>
                </>
              ) : null}
              <button onClick={() => insertSnippetIntoNotes(s.text)}>Insert into Notes</button>
            </li>
          ))}
      </ul>
      {contextMenuVisible && (
        <div
          className="context-menu"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <button
            onClick={() => {
              handleAddSnippet();
              closeContextMenu();
            }}
          >
            Add Snippet
          </button>
        </div>
      )}
    </div>
  );
};

export default SnippetManager;
