import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hrms-api-onmn.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
