const store = require('../models/dataStore');

const getGroups = () => store.get('groups');
const getPatients = () => store.get('patients');

exports.createGroup = async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ message: "Missing required fields: name, description." });
    }

    const groups = getGroups();
    const groupId = Object.keys(groups).length + 1;
    groups[groupId] = { name, description, patients: [] };

    await store.save();
    res.json({ groupId, ...groups[groupId] });
};

exports.getGroupById = (req, res) => {
    const groups = getGroups();
    const group = groups[req.params.groupId];
    group ? res.json(group) : res.status(404).json({ message: "Group not found" });
};

exports.addPatientToGroup = async (req, res) => {
    const { groupId, patientId } = req.params;
    const groups = getGroups();
    const patients = getPatients();

    const group = groups[groupId];
    const patient = patients.find(p => p.id === parseInt(patientId));

    if (!group || !patient) return res.status(404).json({ message: "Group or Patient not found" });

    // Check if already in group? logic wasn't in original but good to have. 
    // Original just pushed. Let's keep original behavior for now or it might break tests if they expect duplicates? 
    // Usually duplicates are bad. I'll stick to original logic to reproduce exact behavior first.
    group.patients.push(patient);

    await store.save();
    res.json(group);
};

exports.removePatientFromGroup = async (req, res) => {
    const { groupId, patientId } = req.params;
    const groups = getGroups();
    const group = groups[groupId];

    if (group) {
        group.patients = group.patients.filter(p => p.id !== parseInt(patientId));
        await store.save();
        res.json(group);
    } else {
        res.status(404).json({ message: "Group not found" });
    }
};
