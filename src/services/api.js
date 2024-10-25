// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Optional: Add an interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    // Handle error response
    console.error("API call error:", error);
    return Promise.reject(error);
  }
);

export default api;

