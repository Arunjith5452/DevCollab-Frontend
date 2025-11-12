import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (request) => request,
  async (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object") {
      const { success, message, data } = response.data;

      if (success === true) {
        return {
          ...response,
          data,
          message, 
        };
      }
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    console.error(" API Error:", error.response?.data);

    if (error.response?.data?.blocked) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post("/api/auth/refresh", {}, { withCredentials: true });
        const accessToken = refreshRes.data.accessToken;

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        if (refreshError.response?.status === 401) {
          if (typeof window !== "undefined") {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
        }
        return Promise.reject(refreshError);
      }
    }

    //  Common Error Handling
    if (error.response?.data && typeof error.response.data === "object") {
      const { success, message, error: errorMsg } = error.response.data;

      if (success === false) {
        toast.error(message || errorMsg || "Something went wrong.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } else if (status === 404) {
      toast.error("Requested resource not found.");
    } else if (status === 500) {
      toast.error("Server error! Please try again later.");
    } else if (!status) {
      toast.error("Network error! Check your internet connection.");
    }

    console.error(
      ` API Error: ${status || "NETWORK"} - ${error.response?.data?.message || error.message}`
    );

    return Promise.reject(error);
  }
);

export default api;
