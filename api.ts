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
  
  // Показываем loading для всех запросов кроме коротких
  if (!config.url?.includes('health') && !config.url?.includes('test-db')) {
    // Здесь можно добавить глобальное состояние загрузки
    console.log(`🔄 Starting request to: ${config.url}`);
  }
  
  return config;
});

// Обработка ответов и ошибок
api.interceptors.response.use(
  (response) => {
    // Скрываем loading при успешном ответе
    if (!response.config.url?.includes('health') && !response.config.url?.includes('test-db')) {
      console.log(`✅ Request completed: ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Скрываем loading при ошибке
    if (!error.config?.url?.includes('health') && !error.config?.url?.includes('test-db')) {
      console.log(`❌ Request failed: ${error.config?.url}`);
    }
    
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
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post<LoginResponse>('/auth/register', userData),
  getMe: () => api.get<User>('/auth/me'),
  sendVerification: (email: string) =>
    api.post<{ success: boolean; message: string; demoCode?: string }>('/auth/send-verification', { email }),
  verifyCode: (email: string, code: string) =>
    api.post<{ success: boolean; message: string }>('/auth/verify-code', { email, code }),
  checkVerification: (email: string) =>
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
    sort?: string;
  }) => api.get<{ ads: TradeAdWithDetails[]; total: number; page: number; pages: number }>('/trade-ads', { params }),
  
  createAd: (data: FormData) => 
    api.post<TradeAd>('/trade-ads', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getAdById: (id: string) => api.get<TradeAdWithDetails>(`/trade-ads/${id}`),
  
  updateAd: (id: string, data: FormData) => 
    api.put<TradeAd>(`/trade-ads/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteAd: (id: string) => api.delete<{ success: boolean }>(`/trade-ads/${id}`),
  
  getMyAds: () => api.get<TradeAdWithDetails[]>('/trade-ads/my'),
};

export const wishlistAPI = {
  getMyWishlist: () => api.get<WishlistItem[]>('/wishlist/me'),
  addToWishlist: (data: { figurineId: string; note?: string; priority?: number }) => 
    api.post<WishlistItem>('/wishlist', data),
  updateWishlistItem: (id: string, data: { note?: string; priority?: number }) => 
    api.put<WishlistItem>(`/wishlist/${id}`, data),
  removeFromWishlist: (id: string) => api.delete<{ success: boolean }>(`/wishlist/${id}`),
  getFigurineWishlistStatus: (figurineId: string) =>
    api.get<{ inWishlist: boolean; note?: string }>(`/wishlist/status/${figurineId}`),
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

export const profileAPI = {
  getProfile: (userId: string) => api.get(`/users/${userId}/profile`),
  updateProfile: (data: any) => api.put('/profile', data),
  uploadAvatar: (data: FormData) => 
    api.post('/profile/avatar', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getUserWishlist: (userId: string) => api.get(`/users/${userId}/wishlist`),
  getUserTradeAds: (userId: string) => api.get(`/users/${userId}/trade-ads`),
};

export const chatAPI = {
  getChats: () => api.get<Chat[]>('/chats'),
  getMessages: (chatId: string) => api.get<Message[]>(`/chats/${chatId}/messages`),
  sendMessage: (data: { 
    receiverId: string; 
    content: string; 
    tradeId?: string 
  }) => api.post<Message>('/messages', data),
  sendTradeOffer: (data: { 
    tradeAdId: string; 
    message: string; 
    imageUrl: string 
  }) => api.post<{ tradeOffer: TradeOffer; message: Message }>('/trade-offers', data),
  acceptTradeOffer: (offerId: string, accept: boolean) => 
    api.post(`/trade-offers/${offerId}/accept`, { accept }),
  finishTrade: (tradeId: string, data: { rating?: number; comment?: string }) => 
    api.post(`/trades/${tradeId}/finish`, data),
  submitComplaint: (data: { 
    reportedUserId: string; 
    reason: string; 
    details: string;
    chatId?: string;
  }) => api.post('/complaints', data),
  sendTradeOfferWithFile: (formData: FormData) => 
    api.post<{ 
      success: boolean; 
      tradeOffer: TradeOffer; 
      message: Message & { imageUrl?: string }
    }>('/chat/trade-offer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),
};

// Типы
export interface Chat {
  id: string;
  otherUser: {
    id: string;
    username: string;
    profile?: {
      avatar: string;
    };
    region?: string;
  };
  lastMessage?: Message;
  tradeAd?: {
    id: string;
    title: string;
    status: string;
    photo?: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  tradeId?: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    username: string;
    profile?: {
      avatar: string;
    };
  };
}

export interface TradeOffer {
  id: string;
  tradeAdId: string;
  userId: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export default api;