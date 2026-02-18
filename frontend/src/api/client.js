import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/api/accounts/refresh/`,
            { refresh: refreshToken }
          );

          const newAccessToken = res.data.access;
          localStorage.setItem("token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          window.location.href = "/auth?mode=login";
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = "/auth?mode=login";
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/api/accounts/register/", data),
  login: (data) => api.post("/api/accounts/login/", data),
  refresh: (refreshToken) =>
    api.post("/api/accounts/refresh/", { refresh: refreshToken }),
  profile: () => api.get("/api/accounts/profile/"),
  updateProfile: (data) => api.put("/api/accounts/profile/", data),
  logout: () => api.post("/api/accounts/logout/"),
};

export default api;