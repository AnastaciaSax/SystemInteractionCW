// src/services/api.ts (упрощенная версия)
import axios from 'axios';
import { 
  User, 
  LoginResponse, 
  Figurine, 
  TradeAd, 
  WishlistItem, 
  Article 
} from './types';

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

// API методы (TypeScript будет выводить типы автоматически)
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post<LoginResponse>('/auth/register', userData),
  getMe: () => api.get<User>('/auth/me'),
};

export const figurinesAPI = {
  getAll: (filters?: { search?: string; rarity?: string; series?: string }) =>
    api.get<Figurine[]>('/figurines', { params: filters }),
  getById: (id: string) => api.get<Figurine>(`/figurines/${id}`),
};

export const usersAPI = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
};

export const tradeAPI = {
  getAds: () => api.get<TradeAd[]>('/trade-ads'),
  createAd: (data: any) => api.post<TradeAd>('/trade-ads', data),
  getAdById: (id: string) => api.get<TradeAd>(`/trade-ads/${id}`),
};

export const wishlistAPI = {
  getMyWishlist: () => api.get<WishlistItem[]>('/wishlist/me'),
  addToWishlist: (data: any) => api.post<WishlistItem>('/wishlist', data),
  removeFromWishlist: (id: string) => api.delete<{ success: boolean }>(`/wishlist/${id}`),
};

export const articlesAPI = {
  getAll: () => api.get<Article[]>('/articles'),
  getByCategory: (category: string) => api.get<Article[]>(`/articles?category=${category}`),
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