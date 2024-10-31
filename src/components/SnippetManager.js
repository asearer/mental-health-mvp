// src/components/SnippetManager.js
import React, { useState, useEffect } from 'react';
import './SnippetManager.css';

// Sample user for demonstration
const currentUser = { id: 1, name: 'Practitioner A' }; // Replace with actual user info

const SnippetManager = () => {
    const [snippets, setSnippets] = useState([]);
    const [snippet, setSnippet] = useState('');
    const [notes, setNotes] = useState(''); // State for notes
    const [editIndex, setEditIndex] = useState(null);
    const [privacy, setPrivacy] = useState('private'); // State for privacy setting
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    // Handler to add or update a snippet
    const handleAddSnippet = () => {
        if (snippet.trim() === '') {
            alert('Snippet cannot be empty');
            return;
        }

        const newSnippet = {
            text: snippet,
            owner: currentUser.name, // Store the owner of the snippet
            date: new Date().toISOString(),
            privacy, // Add privacy setting
            notes: notes.trim(), // Add notes
        };

        if (editIndex !== null) {
            const updatedSnippets = snippets.map((s, index) => (index === editIndex ? newSnippet : s));
            setSnippets(updatedSnippets);
            setEditIndex(null);
        } else {
            setSnippets([...snippets, newSnippet]);
        }

        // Reset fields after adding
        setSnippet('');
        setNotes(''); // Reset notes
        setPrivacy('private'); // Reset privacy after adding
    };

    // Handler to edit a snippet
    const handleEditSnippet = (index) => {
        const selectedSnippet = snippets[index];
        setSnippet(selectedSnippet.text);
        setNotes(selectedSnippet.notes); // Set notes for editing
        setPrivacy(selectedSnippet.privacy);
        setEditIndex(index);
    };

    // Handler to delete a snippet
    const handleDeleteSnippet = (index) => {
        const updatedSnippets = snippets.filter((_, i) => i !== index);
        setSnippets(updatedSnippets);
        if (editIndex === index) {
            setEditIndex(null);
            setSnippet('');
            setNotes(''); // Reset notes when deleting
            setPrivacy('private');
        }
    };

    // Handle right-click context menu
    const handleContextMenu = (event) => {
        event.preventDefault();
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            setSnippet(selectedText);
            setContextMenuVisible(true);
            setContextMenuPosition({ x: event.pageX, y: event.pageY });
        }
    };

    // Close context menu when clicking elsewhere
    const closeContextMenu = () => {
        setContextMenuVisible(false);
    };

    // Function to insert snippet text into the notes input
    const insertSnippetIntoNotes = (text) => {
        setNotes((prevNotes) => `${prevNotes} ${text}`); // Append the snippet text to the notes
        closeContextMenu(); // Close the context menu after insertion
    };

    useEffect(() => {
        window.addEventListener('click', closeContextMenu);
        return () => {
            window.removeEventListener('click', closeContextMenu);
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
                    {editIndex !== null ? 'Update Snippet' : 'Add Snippet'}
                </button>
            </div>
            <ul className="snippet-list">
                {snippets
                    .filter((s) => s.privacy === 'public' || s.owner === currentUser.name) // Show only public or owned snippets
                    .map((s, index) => (
                        <li key={index}>
                            <span onClick={() => console.log(`Using snippet: ${s.text}`)} className="snippet-text">
                                {s.text} <span className="snippet-owner">by {s.owner}</span>
                                {s.privacy === 'public' && <span className="snippet-public"> (Public)</span>}
                            </span>
                            {s.notes && <div className="snippet-notes">Notes: {s.notes}</div>} {/* Display notes */}
                            {s.owner === currentUser.name ? ( // Only show edit/delete buttons for owner's snippets
                                <>
                                    <button onClick={() => handleEditSnippet(index)}>Edit</button>
                                    <button onClick={() => handleDeleteSnippet(index)}>Delete</button>
                                </>
                            ) : null}
                            <button onClick={() => insertSnippetIntoNotes(s.text)}>Insert into Notes</button> {/* Button to insert snippet */}
                        </li>
                    ))}
            </ul>
            {contextMenuVisible && (
                <div className="context-menu" style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}>
                    <button onClick={() => { handleAddSnippet(); closeContextMenu(); }}>Add Snippet</button>
                </div>
            )}
        </div>
    );
};

export default SnippetManager;


