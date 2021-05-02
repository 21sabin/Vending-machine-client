import axios from 'axios';

export const API_BASE_URL = 'http://localhost:4000/api'

const instance = axios.create({
  baseURL: API_BASE_URL
});

instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

export { instance };