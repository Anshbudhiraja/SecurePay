import axios from 'axios';
import useAuthStore from '@/stores/authStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Adding the token)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (The Emergency Logout)
axiosInstance.interceptors.response.use(
  (response) => response, // If status is 2xx, just return the response
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Emergency Logout triggered.");
      
      // 1. Clear the Zustand store
      useAuthStore.getState().resetAuth();
      
      // 2. Optional: Force redirect to login
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;