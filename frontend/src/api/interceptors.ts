// Create this file: frontend/src/api/interceptors.ts

import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Setup interceptors
export const setupInterceptors = (logout: () => void) => {
  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        logout();
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );
};

export default api;