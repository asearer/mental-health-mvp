const store = require('../models/dataStore');

// Helpers
const getPatients = () => store.get('patients');
const getPatientNotes = () => store.get('patientNotes');
const getSessions = () => store.get('sessions');

exports.getAllPatients = (req, res) => {
    res.json(getPatients());
};

exports.getPatientById = (req, res) => {
    const patients = getPatients();
    const patient = patients.find(p => p.id === parseInt(req.params.id));
    if (patient) {
        const notes = getPatientNotes()[req.params.id] || [];
        res.json({ ...patient, therapyNotes: notes });
    } else {
        res.status(404).json({ message: "Patient not found" });
    }
};

exports.createPatient = async (req, res) => {
    const { name, age, info } = req.body;
    if (!name || !age || !info) {
        return res.status(400).json({ message: "Missing required fields: name, age, info." });
    }

    const patients = getPatients();
    // Simple ID generation strategy: max ID + 1 or length + 1. 
    // Length + 1 is risky if deletions happen. Let's find max ID.
    const maxId = patients.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newPatient = { id: maxId + 1, name, age, info };

    patients.push(newPatient);
    await store.save();

    res.status(201).json(newPatient);
};

exports.updatePatient = async (req, res) => {
    const patients = getPatients();
    const patient = patients.find(p => p.id === parseInt(req.params.id));

    if (patient) {
        Object.assign(patient, req.body);
        await store.save();
        res.json(patient);
    } else {
        res.status(404).json({ message: "Patient not found" });
    }
};

exports.deletePatient = async (req, res) => {
    const patients = getPatients();
    const patientIndex = patients.findIndex(p => p.id === parseInt(req.params.id));

    if (patientIndex !== -1) {
        const removedPatient = patients.splice(patientIndex, 1)[0];

        // Also cleanup notes?
        const patientNotes = getPatientNotes();
        delete patientNotes[req.params.id];

        // Also cleanup sessions?
        const sessions = getSessions();
        delete sessions[req.params.id];

        await store.save();
        res.json(removedPatient);
    } else {
        res.status(404).json({ message: "Patient not found" });
    }
};

// --- Notes ---

exports.getNotes = (req, res) => {
    const notes = getPatientNotes()[req.params.id] || [];
    res.json(notes);
};

exports.createNote = async (req, res) => {
    const patientId = req.params.id;
    const { note, counselor = "Default Counselor" } = req.body;

    if (!note) return res.status(400).json({ message: "Invalid note" });

    const patientNotes = getPatientNotes();
    patientNotes[patientId] = patientNotes[patientId] || [];

    const newNote = { date: new Date().toISOString(), counselor, content: note };
    patientNotes[patientId].push(newNote);

    await store.save();
    res.status(200).json({ message: "Note saved successfully!" }); // Use 201 ideally
};

// --- Sessions ---

exports.getSessions = (req, res) => {
    const sessions = getSessions()[req.params.id] || [];
    res.json(sessions);
};

exports.createSession = async (req, res) => {
    const patientId = req.params.id;
    const { date, duration, counselor, notes } = req.body;

    const sessions = getSessions();
    if (!sessions[patientId]) sessions[patientId] = [];

    const newSession = { date, duration, counselor, notes };
    sessions[patientId].push(newSession);

    await store.save();
    res.status(200).json({ message: "Session logged successfully", session: newSession }); // Use 201
};

exports.deleteSession = async (req, res) => {
    const { id, sessionIndex } = req.params;
    const sessions = getSessions();

    if (sessions[id] && sessions[id][sessionIndex]) {
        sessions[id].splice(sessionIndex, 1);
        await store.save();
        res.status(200).json({ message: "Session deleted successfully" });
    } else {
        res.status(404).json({ message: "Session not found" });
    }
};
