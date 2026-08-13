import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('shopez_user')
      ? JSON.parse(localStorage.getItem('shopez_user'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default API;
