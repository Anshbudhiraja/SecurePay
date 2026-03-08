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

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Emergency Logout triggered.");
      useAuthStore.getState().resetAuth();  
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;