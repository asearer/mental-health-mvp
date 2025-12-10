const store = require('./src/models/dataStore');

const mockPatients = [
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

async function seed() {
    console.log("Seeding database...");
    await store.init();

    // Only seed if empty to avoid overwriting real data later? 
    // For now, let's just force seed patients if they are empty.
    const currentPatients = store.get('patients');
    if (currentPatients.length === 0) {
        await store.set('patients', mockPatients);
        console.log("Seeded patients.");
    } else {
        console.log("Database already has patients, skipping seed.");
    }

    console.log("Seeding complete.");
}

seed().catch(console.error);
