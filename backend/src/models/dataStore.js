const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/db.json');

// Default initial data structure
const initialData = {
    patients: [],
    patientNotes: {},
    snippets: [],
    groups: {},
    sessions: {}
};

class DataStore {
    constructor() {
        this.data = null;
    }

    async init() {
        try {
            await fs.access(DATA_FILE);
            const content = await fs.readFile(DATA_FILE, 'utf-8');
            this.data = JSON.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist, create it with initial data
                this.data = JSON.parse(JSON.stringify(initialData));
                await this.save();
            } else {
                throw error;
            }
        }
    }

    async save() {
        if (!this.data) return;
        await fs.writeFile(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        return this.save();
    }
    
    // Helper to get all data (reference)
    getAll() {
        return this.data;
    }
}

const store = new DataStore();
module.exports = store;
