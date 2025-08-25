// src/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration (allow frontend dev servers)
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// -------------------- Mock Data --------------------
let patients = [
    { id: 1, name: "John Doe", age: 30, info: "No known allergies. Arachnophobia unlikely." },
    { id: 2, name: "Jane Smith", age: 25, info: "Has a peanut allergy." },
    { id: 3, name: "Alice Johnson", age: 40, info: "Regular check-ups required." },
    { id: 4, name: "Michael Brown", age: 55, info: "History of hypertension." },
    { id: 5, name: "Sarah Davis", age: 22, info: "No known medical history." },
    { id: 6, name: "David Wilson", age: 35, info: "Suffers from migraines." },
    { id: 7, name: "Laura Garcia", age: 60, info: "Diabetic, requires regular insulin." },
    { id: 8, name: "James Martinez", age: 28, info: "Recently moved, needs new physician." },
    { id: 9, name: "Linda Rodriguez", age: 45, info: "Family history of heart disease." },
    { id: 10, name: "Paul Lee", age: 33, info: "No significant health issues." },
];

let patientNotes = {};
let snippets = [];
let groups = {};
let sessions = {};

// -------------------- Helpers --------------------
const findPatientById = (id) => patients.find(p => p.id === parseInt(id));
const findGroupById = (groupId) => groups[groupId];
const findSnippetById = (id) => snippets[id];
const validateRequest = (req, requiredFields) => requiredFields.every(field => req.body[field]);

// -------------------- API Routes --------------------

// Patients
app.get("/api/patients", (req, res) => res.json(patients));

app.get("/api/patients/:id", (req, res) => {
    const patient = findPatientById(req.params.id);
    if (patient) {
        const notes = patientNotes[req.params.id] || [];
        res.json({ ...patient, therapyNotes: notes });
    } else {
        res.status(404).json({ message: "Patient not found" });
    }
});

app.post("/api/patients", (req, res) => {
    if (!validateRequest(req, ["name", "age", "info"])) {
        return res.status(400).json({ message: "Missing required fields: name, age, info." });
    }
    const { name, age, info } = req.body;
    const newPatient = { id: patients.length + 1, name, age, info };
    patients.push(newPatient);
    res.json(newPatient);
});

app.put("/api/patients/:id", (req, res) => {
    const patient = findPatientById(req.params.id);
    if (patient) {
        Object.assign(patient, req.body);
        res.json(patient);
    } else {
        res.status(404).json({ message: "Patient not found" });
    }
});

app.delete("/api/patients/:id", (req, res) => {
    const patientIndex = patients.findIndex(p => p.id === parseInt(req.params.id));
    if (patientIndex !== -1) {
        const removedPatient = patients.splice(patientIndex, 1)[0];
        delete patientNotes[req.params.id];
        res.json(removedPatient);
    } else {
        res.status(404).json({ message: "Patient not found" });
    }
});

// Notes
app.get("/api/patients/:id/notes", (req, res) => {
    res.json(patientNotes[req.params.id] || []);
});

app.post("/api/patients/:id/notes", (req, res) => {
    const patientId = req.params.id;
    const { note, counselor = "Default Counselor" } = req.body;
    if (!note) return res.status(400).json({ message: "Invalid note" });

    patientNotes[patientId] = patientNotes[patientId] || [];
    const newNote = { date: new Date().toISOString(), counselor, content: note };
    patientNotes[patientId].push(newNote);
    res.status(200).json({ message: "Note saved successfully!" });
});

// Groups
app.post("/api/groups", (req, res) => {
    if (!validateRequest(req, ["name", "description"])) {
        return res.status(400).json({ message: "Missing required fields: name, description." });
    }
    const { name, description } = req.body;
    const groupId = Object.keys(groups).length + 1;
    groups[groupId] = { name, description, patients: [] };
    res.json({ groupId, ...groups[groupId] });
});

app.get("/api/groups/:groupId", (req, res) => {
    const group = findGroupById(req.params.groupId);
    group ? res.json(group) : res.status(404).json({ message: "Group not found" });
});

app.post("/api/groups/:groupId/patients/:patientId", (req, res) => {
    const { groupId, patientId } = req.params;
    const group = findGroupById(groupId);
    const patient = findPatientById(patientId);

    if (!group || !patient) return res.status(404).json({ message: "Group or Patient not found" });

    group.patients.push(patient);
    res.json(group);
});

app.delete("/api/groups/:groupId/patients/:patientId", (req, res) => {
    const { groupId, patientId } = req.params;
    const group = findGroupById(groupId);
    if (group) {
        group.patients = group.patients.filter(p => p.id !== parseInt(patientId));
        res.json(group);
    } else {
        res.status(404).json({ message: "Group not found" });
    }
});

// Snippets
app.get("/api/snippets", (req, res) => res.json(snippets));

app.post("/api/snippets", (req, res) => {
    const { text, owner } = req.body;
    if (!text || !owner) return res.status(400).json({ message: "Snippet text and owner are required." });

    const newSnippet = { id: snippets.length, text, owner, date: new Date().toISOString() };
    snippets.push(newSnippet);
    res.status(201).json(newSnippet);
});

app.put("/api/snippets/:id", (req, res) => {
    const snippet = findSnippetById(req.params.id);
    if (snippet) {
        if (req.body.text) {
            snippet.text = req.body.text;
            res.json(snippet);
        } else {
            res.status(400).json({ message: "Snippet text is required." });
        }
    } else {
        res.status(404).json({ message: "Snippet not found." });
    }
});

app.delete("/api/snippets/:id", (req, res) => {
    const snippetIndex = snippets.findIndex(s => s.id === parseInt(req.params.id));
    if (snippetIndex !== -1) {
        const removedSnippet = snippets.splice(snippetIndex, 1)[0];
        res.json(removedSnippet);
    } else {
        res.status(404).json({ message: "Snippet not found." });
    }
});

// Sessions
app.post("/api/patients/:id/sessions", (req, res) => {
    const patientId = req.params.id;
    const { date, duration, counselor, notes } = req.body;
    if (!sessions[patientId]) sessions[patientId] = [];
    const newSession = { date, duration, counselor, notes };
    sessions[patientId].push(newSession);
    res.status(200).json({ message: "Session logged successfully", session: newSession });
});

app.get("/api/patients/:id/sessions", (req, res) => {
    res.json(sessions[req.params.id] || []);
});

app.delete("/api/patients/:id/sessions/:sessionIndex", (req, res) => {
    const { id, sessionIndex } = req.params;
    if (sessions[id] && sessions[id][sessionIndex]) {
        sessions[id].splice(sessionIndex, 1);
        res.status(200).json({ message: "Session deleted successfully" });
    } else {
        res.status(404).json({ message: "Session not found" });
    }
});

// -------------------- Serve Frontend in Production --------------------
if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "../dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}

// -------------------- Start Server --------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
