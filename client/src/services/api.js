import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL:
    import.meta.env.VITE_APP_ENV === "development"
      ? import.meta.env.VITE_APP_BACKEND_URL_PROD
      : import.meta.env.VITE_APP_BACKEND_URL_PROD,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Response interceptor for handling authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 errors (unauthorized) which may indicate expired cookie
    if (error.response && error.response.status === 401) {
      // We'll let the components handle redirect based on the auth state
      console.log("Authentication error detected");
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  register: (userData) => api.post("/api/v1/auth/register", userData),
  login: (credentials) => api.post("/api/v1/auth/login", credentials),
  logout: () => api.get("/api/v1/auth/logout"),
  getMe: () => api.get("/api/v1/auth/me"),
  forgotPassword: (email) =>
    api.post("/api/v1/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.patch(`/api/v1/auth/reset-password/${token}`, { password }),
  updatePassword: (passwordData) =>
    api.patch("/api/v1/auth/update-password", passwordData),
};

// Career API calls
export const careerApi = {
  getCareerPath: (goal, currentQualification, learnerType = "slow") =>
    api.post(
      "/services/carreer",
      {},
      {
        params: {
          goal,
          current_qualificaion: currentQualification,
          learner_type: learnerType,
        },
      }
    ),
};

// Revision API calls
export const revisionApi = {
  getRevisionStrategies: (topic, learnerType = "medium") =>
    api.post(
      "/services/revision",
      {},
      {
        params: {
          topic,
          learner_type: learnerType,
        },
      }
    ),
};

// User API calls
export const userApi = {
  updateProfile: (userData) =>
    api.patch("/api/v1/user/update-profile", userData),
  uploadProfileImage: (formData) =>
    api.post("/api/v1/user/upload-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;
