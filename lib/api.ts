import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/token', formData);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/users/', { username, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Expense services
export const expenseService = {
  getAll: async () => {
    const response = await api.get('/expenses/');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (expense: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }) => {
    const response = await api.post('/expenses/', expense);
    return response.data;
  },

  update: async (id: number, expense: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }) => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  getStatsByCategory: async () => {
    const response = await api.get('/expenses/stats/category');
    return response.data;
  },

  getStatsByTime: async (startDate: string, endDate: string) => {
    const response = await api.get('/expenses/stats/time', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
}; 