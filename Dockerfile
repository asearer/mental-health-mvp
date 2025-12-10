# Build stage
FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install root dependencies (including vite for build)
RUN npm install

# Install backend dependencies
RUN cd backend && npm install --production

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 8000

# Start backend (which serves frontend)
ENV NODE_ENV=production
CMD ["node", "backend/src/server.js"]
