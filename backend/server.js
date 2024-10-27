const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8000;

// CORS options configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow only your frontend's origin
  methods: "GET,POST", // Allow specific HTTP methods
  optionsSuccessStatus: 200, // For legacy browsers
};

// Middleware
app.use(cors(corsOptions)); // Use CORS with the defined options
app.use(bodyParser.json()); // Parse incoming JSON requests

// Sample patient data with additional mock data
let patients = [
  { id: 1, name: "John Doe", age: 30, info: "No known allergies. Arachnaphobia unlikely." },
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

// New data structure for patient notes
let patientNotes = {};

// Routes

// Get all patients
app.get("/api/patients", (req, res) => {
  console.log("Fetching patients...");
  try {
    console.log("Patients data:", JSON.stringify(patients));
    res.json(patients); // Send the patients data as JSON
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients data" });
  }
});

// Get a specific patient by ID
app.get("/api/patients/:id", (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (patient) {
    // Add notes to the patient data if available
    const notes = patientNotes[req.params.id] || [];
    res.json({ ...patient, therapyNotes: notes });
  } else {
    res.status(404).json({ message: "Patient not found" });
  }
});

// Save notes for a specific patient
app.post('/api/patients/:id/notes', (req, res) => {
  const patientId = req.params.id;
  const { note } = req.body; // Expecting { note: "note content" }

  // Validate input
  if (!note || typeof note !== 'string') {
    return res.status(400).json({ message: "Invalid note" });
  }

  // Initialize notes array if it doesn't exist
  if (!patientNotes[patientId]) {
    patientNotes[patientId] = [];
  }

  // Add the new note with a timestamp
  patientNotes[patientId].push({
    date: new Date().toISOString(),
    counselor: "Default Counselor", // You can replace this with actual counselor's name
    content: note
  });

  console.log(`Note added for patient ${patientId}:`, note);
  res.status(200).json({ message: 'Note saved successfully!' });
});

// Add a new patient
app.post("/api/patients", (req, res) => {
  const { name, age, info } = req.body;
  const newPatient = { id: patients.length + 1, name, age, info };
  patients.push(newPatient);
  res.json(newPatient);
});

// Update a patient
app.put("/api/patients/:id", (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (patient) {
    patient.name = req.body.name;
    patient.age = req.body.age;
    patient.info = req.body.info;
    res.json(patient);
  } else {
    res.status(404).json({ message: "Patient not found" });
  }
});

// Delete a patient
app.delete("/api/patients/:id", (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (patient) {
    const index = patients.indexOf(patient);
    patients.splice(index, 1);
    res.json(patient);
  } else {
    res.status(404).json({ message: "Patient not found" });
  }
});

// Get patient notes
app.get("/api/patients/:id/notes", (req, res) => {
  const patientId = req.params.id;
  if (patientNotes[patientId]) {
    res.json(patientNotes[patientId]);
  } else {
    res.status(404).json({ message: "Patient notes not found" });
  }
});

// Get specific patient note
app.get("/api/patients/:id/notes/:noteId", (req, res) => {
  const patientId = req.params.id;
  const noteId = req.params.noteId;
  if (patientNotes[patientId] && patientNotes[patientId][noteId]) {
    res.json(patientNotes[patientId][noteId]);
  } else {
    res.status(404).json({ message: "Patient note not found" });
  }
});

// Get specific patient note by date
app.get("/api/patients/:id/notes/:date", (req, res) => {
  const patientId = req.params.id;
  const date = req.params.date;
  if (patientNotes[patientId]) {
    const notes = patientNotes[patientId].filter(note => note.date === date);
    if (notes.length > 0) {
      res.json(notes[0]);
    } else {
      res.status(404).json({ message: "Patient note not found" });
    }
  } else {
    res.status(404).json({ message: "Patient notes not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});







