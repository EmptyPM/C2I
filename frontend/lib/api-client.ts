import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Add request interceptor to attach Authorization header
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };







