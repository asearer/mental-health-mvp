const app = require('./app');
const store = require('./models/dataStore');

const PORT = process.env.PORT || 8000;

async function startServer() {
    try {
        // Initialize Data Store
        await store.init();
        console.log("Data Store initialized.");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
