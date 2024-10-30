// src/components/SnippetManager.js
import React, { useState } from 'react';
import './SnippetManager.css';

const SnippetManager = () => {
    const [snippets, setSnippets] = useState([]);
    const [snippet, setSnippet] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    // Handler to add or update a snippet
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

    // Function to handle right-click to show context menu
    const handleContextMenu = (e) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        const selection = document.getSelection().toString();
        
        if (selection) {
            setSnippet(selection);
            setContextMenuVisible(true);
            setContextMenuPosition({ x: e.pageX, y: e.pageY });
        } else {
            alert('Please highlight text to create a snippet.');
        }
    };

    // Function to close the context menu
    const closeContextMenu = () => {
        setContextMenuVisible(false);
    };

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

            {contextMenuVisible && (
                <div
                    className="context-menu"
                    style={{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }}
                    onMouseLeave={closeContextMenu}
                >
                    <button onClick={() => handleAddSnippet()}>Add Snippet from Selection</button>
                    <button onClick={closeContextMenu}>Close</button>
                </div>
            )}

            
        </div>
    );
};

export default SnippetManager;