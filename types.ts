export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  age?: number;
  parentEmail?: string;
  isVerified: boolean;
  region?: 'USA' | 'EU' | 'CIS' | 'ASIA' | 'OTHER';
  createdAt: string;
  updatedAt: string;
  profile?: Profile; // ← важно: профиль может быть undefined
}

export interface Profile {
  id: string;
  userId: string;
  avatar: string;
  bio?: string;
  location?: string;
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
  location: string;
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