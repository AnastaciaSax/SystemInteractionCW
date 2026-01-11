import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// API методы
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const figurinesAPI = {
  getAll: (filters?: { search?: string; rarity?: string; series?: string }) =>
    api.get('/figurines', { params: filters }),
  getById: (id: string) => api.get(`/figurines/${id}`),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
};

export const tradeAPI = {
  getAds: () => api.get('/trade-ads'),
  createAd: (data: any) => api.post('/trade-ads', data),
  getAdById: (id: string) => api.get(`/trade-ads/${id}`),
};

export const wishlistAPI = {
  getMyWishlist: () => api.get('/wishlist/me'),
  addToWishlist: (data: any) => api.post('/wishlist', data),
  removeFromWishlist: (id: string) => api.delete(`/wishlist/${id}`),
};

export const articlesAPI = {
  getAll: () => api.get('/articles'),
  getByCategory: (category: string) => api.get(`/articles?category=${category}`),
};

// Вспомогательные функции
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export default api;