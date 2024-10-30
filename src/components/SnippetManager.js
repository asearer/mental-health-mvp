import React, { useState } from 'react';

const SnippetManager = () => {
  const [snippets, setSnippets] = useState([]);
  const [snippet, setSnippet] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Handler to add a new snippet
  const handleAddSnippet = () => {
    if (snippet.trim() === '') {
      alert('Snippet cannot be empty');
      return;
    }
    if (editIndex !== null) {
      const updatedSnippets = snippets.map((s, index) => (index === editIndex ? snippet : s));
      setSnippets(updatedSnippets);
      setEditIndex(null);
    } else {
      setSnippets([...snippets, snippet]);
    }
    setSnippet('');
  };

  // Handler to edit a snippet
  const handleEditSnippet = (index) => {
    setSnippet(snippets[index]);
    setEditIndex(index);
  };

  // Handler to delete a snippet
  const handleDeleteSnippet = (index) => {
    const updatedSnippets = snippets.filter((_, i) => i !== index);
    setSnippets(updatedSnippets);
    if (editIndex === index) {
      setEditIndex(null);
      setSnippet('');
    }
  };

  // Handler to use a snippet in notes
  const handleUseSnippet = (snippet) => {
    // Implement the logic to insert this snippet into the current note
    console.log(`Using snippet: ${snippet}`);
  };

  return (
    <div className="snippet-manager">
      <h2>Snippet Manager</h2>
      <div className="snippet-form">
        <input
          type="text"
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          placeholder="Enter your snippet here"
        />
        <button onClick={handleAddSnippet}>
          {editIndex !== null ? 'Update Snippet' : 'Add Snippet'}
        </button>
      </div>
      <ul className="snippet-list">
        {snippets.map((s, index) => (
          <li key={index}>
            <span onClick={() => handleUseSnippet(s)} className="snippet-text">
              {s}
            </span>
            <button onClick={() => handleEditSnippet(index)}>Edit</button>
            <button onClick={() => handleDeleteSnippet(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SnippetManager;
