import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
http.interceptors.request.use(
  (config) => {
    // Get token from localStorage (auth-storage from Zustand or direct access_token)
    const authData = localStorage.getItem("auth-storage");
    let token = null;

    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        token = state?.token;
      } catch (error) {
        console.error("Failed to parse auth-storage:", error);
      }
    }

    // Fallback to direct access_token if zustand store is not available
    if (!token) {
      token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log(`[HTTP Headers]`, config.headers);
    } else {
      console.warn(`[HTTP Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url} - NO TOKEN FOUND`);
    }

    console.log(`[HTTP Request Parameters]`, config.params);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors globally
http.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response.data;
  },
  (error) => {
    console.error(`Error response from ${error.config?.url}:`, error.response?.status, error.response?.data);
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url as string | undefined;

      // Với auth/login: để page tự xử lý lỗi (không redirect về landing)
      const isAuthLogin = url?.includes("/auth/login");

      if (status === 401 && !isAuthLogin) {
        // Unauthorized - clear auth và về trang chủ / landing
        console.error("401 Unauthorized detected, clearing storage and redirecting...");
        localStorage.removeItem("auth-storage");
        window.location.href = "/";
      } else if (status === 403) {
        console.error("Access forbidden (403)");
      } else if (status === 500) {
        console.error("Server error (500)");
      }
    }
    return Promise.reject(error);
  },
);

export default http;
