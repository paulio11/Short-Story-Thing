import axios from "axios";

// Backend url
const API_BASE_URL = "http://localhost:8000";

// Axios defaults
export const backendAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Functionality to intercept API calls
// and notify user if the backend is down etc
let updateBackendAvailability;

export function setBackendAvailabilityCallback(callback) {
  updateBackendAvailability = callback;
}

// Helper to get CSRF token from cookies
function getCsrfToken() {
  const cookies = document.cookie.split("; ");
  const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrftoken="));
  return csrfCookie ? csrfCookie.split("=")[1] : null;
}

// Add CSRF token to headers
backendAPI.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

// Intercept responses
backendAPI.interceptors.response.use(
  (response) => {
    updateBackendAvailability(true);
    return response;
  },
  (error) => {
    // Notify backend is unavailable on error
    if (!error.response || [503, 504].includes(error.response?.status)) {
      updateBackendAvailability(false);
    }
    return Promise.reject(error);
  }
);
