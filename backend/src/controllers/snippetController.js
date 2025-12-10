const store = require('../models/dataStore');

const getSnippets = () => store.get('snippets');

exports.getAllSnippets = (req, res) => {
    res.json(getSnippets());
};

exports.createSnippet = async (req, res) => {
    const { text, owner } = req.body;
    if (!text || !owner) return res.status(400).json({ message: "Snippet text and owner are required." });

    const snippets = getSnippets();
    // Use max ID logic
    const maxId = snippets.reduce((max, s) => (s.id > max ? s.id : max), -1);

    const newSnippet = { id: maxId + 1, text, owner, date: new Date().toISOString() };
    snippets.push(newSnippet);

    await store.save();
    res.status(201).json(newSnippet);
};

exports.updateSnippet = async (req, res) => {
    const snippets = getSnippets();
    const snippet = snippets.find(s => s.id === parseInt(req.params.id));

    if (snippet) {
        if (req.body.text) {
            snippet.text = req.body.text;
            await store.save();
            res.json(snippet);
        } else {
            res.status(400).json({ message: "Snippet text is required." });
        }
    } else {
        res.status(404).json({ message: "Snippet not found." });
    }
};

exports.deleteSnippet = async (req, res) => {
    const snippets = getSnippets();
    const snippetIndex = snippets.findIndex(s => s.id === parseInt(req.params.id));

    if (snippetIndex !== -1) {
        const removedSnippet = snippets.splice(snippetIndex, 1)[0];
        await store.save();
        res.json(removedSnippet);
    } else {
        res.status(404).json({ message: "Snippet not found." });
    }
};
