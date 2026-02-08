// client/src/services/types.ts
export type Region = 'USA' | 'EU' | 'CIS' | 'ASIA' | 'OTHER';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  age?: number;
  parentEmail?: string;
  isVerified: boolean;
  region?: 'USA' | 'EU' | 'CIS' | 'ASIA' | 'OTHER'; // ← Основной регион пользователя
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  avatar: string;
  bio?: string;
  location?: string; // ← Конкретный город/страна
  rating: number;
  status: string;
  achievements: string[];
  tradeCount: number;
}

// Сервер возвращает success: boolean
export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  error?: string; // Добавьте это
}

export interface Figurine {
  id: string;
  number: string;
  name: string;
  mold: 'CAT' | 'DOG' | 'RODENT' | 'CATTLE' | 'KANGAROO' | 'BEAR' | 'OTHER';
  series: 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'OTHER';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EXCLUSIVE';
  year: number;
  description?: string;
  imageUrl: string;
  verified: boolean;
  createdAt: string;
}

export interface TradeAd {
  id: string;
  userId: string;
  figurineId: string;
  title: string;
  description: string;
  condition: 'MINT' | 'TLC' | 'GOOD' | 'NIB';
  location: string; // ← Конкретное местоположение для объявления
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  figurineId: string;
  note?: string;
  priority?: number;
  addedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'CARE_STORAGE' | 'HISTORY_NEWS' | 'RULES_POLITICS' | 'ADVICE_BEGINNERS';
  authorId: string;
  imageUrl?: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
}

export interface TradeAdWithDetails extends TradeAd {
  user: {
    id: string;
    username: string;
    region?: string; // ← Регион пользователя
    profile?: {
      avatar: string;
      rating: number;
    };
  };
  figurine: {
    name: string;
    series: string;
  };
}
export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: 'GENERAL' | 'TRADING' | 'COLLECTING' | 'REVIEWS' | 'NEWS' | 'EVENTS';
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  messageCount: number;
  lastActivity: string;
  participants: number;
  isPinned?: boolean;
  createdAt: string;
}

export interface ForumMessage {
  id: string;
  topicId: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  isRead?: boolean;
  likes?: string[]; // Array of user IDs who liked the message
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'CARE_STORAGE' | 'HISTORY_NEWS' | 'RULES_POLITICS' | 'ADVICE_BEGINNERS';
  authorId: string;
  imageUrl?: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
}