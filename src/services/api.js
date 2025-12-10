// src/services/api.js

/**
 * Robust API service using Axios
 * Features:
 * - Base Axios instance with JSON content-type and auth token support
 * - Global error handling with console notifications
 * - Stale-while-revalidate caching for GET requests
 * - Automatic cache invalidation on mutations
 * - Exponential backoff retries for transient failures
 * - Cancel tokens for request cancellation
 */

import axios from "axios";

// ------------------------
// Utility: Notification
// ------------------------
// Currently using console.error for notifications; could be replaced with toast notifications
const notifyUser = (message) => {
  console.error("Notification:", message);
};

// ------------------------
// Axios Instance
// ------------------------
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000, // 10 seconds timeout
  headers: { "Content-Type": "application/json" },
});

// ------------------------
// Request Interceptor: Auth token
// ------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Optional: retrieve auth token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------
// Response Interceptor: Logging & Notifications
// ------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      notifyUser(
        `API error ${error.response.status}: ${error.response.data?.message || error.message}`
      );
    } else if (error.request) {
      notifyUser("No response from API server.");
    } else {
      notifyUser(`API setup error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

// ------------------------
// Caching (Stale-While-Revalidate)
// ------------------------
const cache = new Map(); // key -> { data, timestamp, expiry }
const defaultExpiry = 30_000; // default cache expiry in ms (30s)
const getCacheKey = (url, params) => `${url}:${params ? JSON.stringify(params) : ""}`;
const clearCache = (urlPrefix) => {
  for (let key of cache.keys()) {
    if (key.startsWith(urlPrefix)) cache.delete(key);
  }
};

// ------------------------
// Cancel Token Helper
// ------------------------
export const createCancelToken = () => {
  const source = axios.CancelToken.source();
  return { token: source.token, cancel: source.cancel };
};

// ------------------------
// Core API Wrapper with:
// - SWR caching
// - Exponential backoff retries
// - Optional cancel tokens
// ------------------------
const safeApiCall = async (
  fn,
  cacheKey = null,
  { expiry = defaultExpiry, retries = 2, cancelToken } = {}
) => {
  // Return cached stale data immediately if valid
  if (cacheKey && cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < expiry) {
      // Trigger background refresh
      fn({ cancelToken })
        .then((res) => cache.set(cacheKey, { data: res.data, timestamp: Date.now(), expiry }))
        .catch((e) => console.error("Background API refresh failed", e));
      return { data, error: null };
    }
  }

  // Retry loop with exponential backoff
  let attempt = 0;
  const backoff = (n) => 500 * 2 ** n; // 500ms base

  while (attempt <= retries) {
    try {
      const response = await fn({ cancelToken });
      if (cacheKey) cache.set(cacheKey, { data: response.data, timestamp: Date.now(), expiry });
      return { data: response.data, error: null };
    } catch (error) {
      if (axios.isCancel(error)) return { data: null, error: "Request canceled" };
      if (attempt === retries) return { data: null, error };
      // Wait before retrying
      await new Promise((res) => setTimeout(res, backoff(attempt)));
      attempt++;
    }
  }
};

// ------------------------
// Helper: GET requests with params & caching
// ------------------------
const getWithParams = (url, params = {}, options = {}) => {
  const key = getCacheKey(url, params);
  const { cancelToken, expiry, retries } = options;
  return safeApiCall((cfg) => api.get(url, { params, cancelToken: cfg.cancelToken }), key, {
    expiry,
    retries,
    cancelToken,
  });
};

// ------------------------
// API Methods
// ------------------------

// --- Patients ---
export const getPatients = (params, options = {}) => getWithParams("/patients", params, options);
export const getPatientById = (id, options = {}) => getWithParams(`/patients/${id}`, {}, options);

export const addPatient = (patient) =>
  safeApiCall(() => api.post("/patients", patient)).then((res) => {
    clearCache("/patients");
    return res;
  });

export const updatePatient = (id, updates) =>
  safeApiCall(() => api.put(`/patients/${id}`, updates)).then((res) => {
    clearCache("/patients");
    clearCache(`/patients/${id}`);
    return res;
  });

export const deletePatient = (id) =>
  safeApiCall(() => api.delete(`/patients/${id}`)).then((res) => {
    clearCache("/patients");
    clearCache(`/patients/${id}`);
    return res;
  });

// --- Therapy Notes ---
export const getNotes = (patientId, params, options) =>
  getWithParams(`/patients/${patientId}/notes`, params, options);

export const addNote = (patientId, note, counselor) =>
  safeApiCall(() => api.post(`/patients/${patientId}/notes`, { note, counselor })).then((res) => {
    clearCache(`/patients/${patientId}/notes`);
    return res;
  });

// --- Patient Groups ---
export const getGroup = (groupId, options) => getWithParams(`/groups/${groupId}`, {}, options);

export const addGroup = (group) =>
  safeApiCall(() => api.post("/groups", group)).then((res) => {
    clearCache("/groups");
    return res;
  });

export const addPatientToGroup = (groupId, patientId) =>
  safeApiCall(() => api.post(`/groups/${groupId}/patients/${patientId}`)).then((res) => {
    clearCache(`/groups/${groupId}`);
    return res;
  });

export const removePatientFromGroup = (groupId, patientId) =>
  safeApiCall(() => api.delete(`/groups/${groupId}/patients/${patientId}`)).then((res) => {
    clearCache(`/groups/${groupId}`);
    return res;
  });

// --- Snippets ---
export const getSnippets = (params, options) => getWithParams("/snippets", params, options);

export const addSnippet = (snippet) =>
  safeApiCall(() => api.post("/snippets", snippet)).then((res) => {
    clearCache("/snippets");
    return res;
  });

export const updateSnippet = (id, text) =>
  safeApiCall(() => api.put(`/snippets/${id}`, { text })).then((res) => {
    clearCache("/snippets");
    return res;
  });

export const deleteSnippet = (id) =>
  safeApiCall(() => api.delete(`/snippets/${id}`)).then((res) => {
    clearCache("/snippets");
    return res;
  });

// --- Therapy Sessions ---
export const getSessions = (patientId, params, options) =>
  getWithParams(`/patients/${patientId}/sessions`, params, options);

export const addSession = (patientId, session) =>
  safeApiCall(() => api.post(`/patients/${patientId}/sessions`, session)).then((res) => {
    clearCache(`/patients/${patientId}/sessions`);
    return res;
  });

export const deleteSession = (patientId, sessionIndex) =>
  safeApiCall(() => api.delete(`/patients/${patientId}/sessions/${sessionIndex}`)).then((res) => {
    clearCache(`/patients/${patientId}/sessions`);
    return res;
  });

// Export base Axios instance as default
export default api;
