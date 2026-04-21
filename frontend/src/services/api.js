import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== '/auth/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const produitService = {
  getAll: () => api.get('/produits'),
  getById: (id) => api.get(`/produits/${id}`),
  create: (data) => api.post('/produits', data),
  update: (id, data) => api.put(`/produits/${id}`, data),
  delete: (id) => api.delete(`/produits/${id}`),
  getByCategory: (categorieId) => api.get(`/produits/categorie/${categorieId}`),
};

export const categorieService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const commandeService = {
  getAll: () => api.get('/commandes'),
  getStats: () => api.get('/commandes/stats'),
  getMyOrders: () => api.get('/commandes/user/me'),
  getById: (id) => api.get(`/commandes/${id}`),
  create: (data) => api.post('/commandes', data),
  updateStatut: (id, statut) => api.put(`/commandes/${id}/statut`, { statut }),
};

export const uploadService = {
  uploadImage: (payload) => api.post('/uploads/image', payload),
};

export default api;