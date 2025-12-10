const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/', groupController.createGroup);
router.get('/:groupId', groupController.getGroupById);
router.post('/:groupId/patients/:patientId', groupController.addPatientToGroup);
router.delete('/:groupId/patients/:patientId', groupController.removePatientFromGroup);

module.exports = router;
