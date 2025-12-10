const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const patientRoutes = require("./routes/patientRoutes");
const groupRoutes = require("./routes/groupRoutes");
const snippetRoutes = require("./routes/snippetRoutes");

const app = express();

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// API Routes
app.use("/api/patients", patientRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/snippets", snippetRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
    // Assuming dist is in root/dist and this file is in backend/src/
    const distPath = path.join(__dirname, "../../dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

module.exports = app;
