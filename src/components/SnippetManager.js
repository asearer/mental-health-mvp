// src/components/SnippetManager.js
import React, { useState, useEffect } from 'react';
import './SnippetManager.css';

// Sample user for demonstration
const currentUser = { id: 1, name: 'Practitioner A' }; // Replace with actual user info

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
        const newSnippet = {
            text: snippet,
            owner: currentUser.name, // Store the owner of the snippet
            date: new Date().toISOString()
        };

        if (editIndex !== null) {
            const updatedSnippets = snippets.map((s, index) => (index === editIndex ? newSnippet : s));
            setSnippets(updatedSnippets);
            setEditIndex(null);
        } else {
            setSnippets([...snippets, newSnippet]);
        }
        setSnippet('');
    };

    // Handler to edit a snippet
    const handleEditSnippet = (index) => {
        setSnippet(snippets[index].text);
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
                <button onClick={handleAddSnippet}>
                    {editIndex !== null ? 'Update Snippet' : 'Add Snippet'}
                </button>
            </div>
            <ul className="snippet-list">
                {snippets.map((s, index) => (
                    <li key={index}>
                        <span onClick={() => console.log(`Using snippet: ${s.text}`)} className="snippet-text">
                            {s.text} <span className="snippet-owner">by {s.owner}</span>
                        </span>
                        {s.owner === currentUser.name ? ( // Only show edit/delete buttons for owner's snippets
                            <>
                                <button onClick={() => handleEditSnippet(index)}>Edit</button>
                                <button onClick={() => handleDeleteSnippet(index)}>Delete</button>
                            </>
                        ) : null}
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
