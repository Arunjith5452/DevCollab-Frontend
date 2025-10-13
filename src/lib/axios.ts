import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (request) => request,
  async (err) => Promise.reject(err)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post('/api/auth/refresh', {}, { withCredentials: true });
        const accessToken = refreshRes.data.data;

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        if (refreshError.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // Common error handling
    if (status === 400) {
      const message =
        err.response?.data?.message || 'Invalid request. Please check your input.';
      toast.error(message);
    } else if (status === 404) {
      toast.error('Requested resource not found.');
    } else if (status === 500) {
      toast.error('Server error! Please try again later.');
    } else if (!status) {
      toast.error('Network error! Check your internet connection.');
    }

    console.error(
      `API Error: ${status || 'NETWORK'} - ${err.response?.data?.message || err.message}`
    );

    return Promise.reject(err);
  }
);

export default api;
