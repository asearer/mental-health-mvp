const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Patient Routes
router.get('/', patientController.getAllPatients);
router.post('/', patientController.createPatient);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

// Nested Route: Notes
router.get('/:id/notes', patientController.getNotes);
router.post('/:id/notes', patientController.createNote);

// Nested Route: Sessions
router.get('/:id/sessions', patientController.getSessions);
router.post('/:id/sessions', patientController.createSession);
router.delete('/:id/sessions/:sessionIndex', patientController.deleteSession);

module.exports = router;
