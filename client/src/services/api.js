import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
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
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors - redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.get("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.patch(`/auth/reset-password/${token}`, { password }),
  updatePassword: (passwordData) =>
    api.patch("/auth/update-password", passwordData),
};

// User API calls
export const userApi = {
  updateProfile: (userData) => api.patch("/user/update-profile", userData),
  uploadProfileImage: (formData) =>
    api.post("/user/upload-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;
