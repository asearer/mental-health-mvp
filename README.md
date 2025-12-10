# Mental Health MVP

A robust, production-ready full-stack application for mental health management.

## Features
- **Patient Management**: Add, view, update, and discharge patients.
- **Therapy Notes**: Log and view therapy notes per patient.
- **Group Sessions**: Manage patient groups.
- **Snippets**: Quick text snippets for counselors.
- **Full Persistence**: Data is saved to `backend/data/db.json`.

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```

### Development
To run the application in development mode with hot-reloading:

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:8000`.

2. Start the frontend (in a new terminal):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000` (or 5173 depending on Vite).

### Production
To build and run the production version:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the backend (which serves the built frontend):
   ```bash
   npm start --prefix backend
   ```
   Visit `http://localhost:8000`.

### Docker
Run the application using Docker:

```bash
docker-compose up --build
```
The app will be available at `http://localhost:8000`.
Data is persisted in the `backend/data` directory on your host.

## Testing
Run unit tests:
```bash
npm test
```

## Linting & Formatting
Check for linting errors:
```bash
npm run lint
```
Format code:
```bash
npm run format
```
