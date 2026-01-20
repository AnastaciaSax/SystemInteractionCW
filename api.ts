// src/services/api.ts 
import axios from 'axios';
import { 
  User, 
  LoginResponse, 
  Figurine, 
  TradeAd, 
  WishlistItem, 
  Article,
   TradeAdWithDetails,
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
  sendVerification: (email: string) =>
    api.post<{ success: boolean; message: string; demoCode?: string }>('/auth/send-verification', { email }),
  verifyCode: (email: string, code: string) =>
    api.post<{ success: boolean; message: string }>('/auth/verify-code', { email, code }),
  checkVerification: (email: string) => // ← Добавьте этот метод
    api.post<{ success: boolean; verified: boolean; message: string }>('/auth/check-verification', { email }),
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
  getAds: (params?: {
    page?: number;
    limit?: number;
    series?: string;
    condition?: string;
    region?: string;
    search?: string;
    sort?: string; // Добавляем сортировку
  }) => api.get<{ ads: TradeAdWithDetails[]; total: number; page: number; pages: number }>('/trade-ads', { params }),
  createAd: (data: any) => api.post<TradeAd>('/trade-ads', data),
  getAdById: (id: string) => api.get<TradeAdWithDetails>(`/trade-ads/${id}`),
  updateAd: (id: string, data: any) => api.put<TradeAd>(`/trade-ads/${id}`, data),
  deleteAd: (id: string) => api.delete<{ success: boolean }>(`/trade-ads/${id}`),
  getMyAds: () => api.get<TradeAdWithDetails[]>('/trade-ads/my'),
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
