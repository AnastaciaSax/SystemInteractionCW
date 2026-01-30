// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from './prisma/client';
import authRoutes from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка загрузки файлов для объявлений
const tradeAdsStorage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = 'uploads/trade-ads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Настройка загрузки файлов для аватаров
const avatarsStorage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadTradeAds = multer({ 
  storage: tradeAdsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const uploadAvatars = multer({ 
  storage: avatarsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Подключаем auth маршруты
app.use('/api/auth', authRoutes);

// Основные эндпоинты
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const figurineCount = await prisma.figurine.count();
    res.json({ 
      users: userCount, 
      figurines: figurineCount,
      status: 'Database connected' 
    });
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Получить всех фигурок (для Wishlist)
app.get('/api/figurines', async (req, res) => {
  try {
    const { search, rarity, series } = req.query;
    
    let whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { number: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (rarity) {
      whereClause.rarity = rarity;
    }
    
    if (series) {
      whereClause.series = series;
    }
    
    const figurines = await prisma.figurine.findMany({
      where: whereClause,
      take: 50,
      orderBy: { name: 'asc' }
    });
    
    res.json(figurines);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            avatar: true,
            rating: true,
            status: true,
            tradeCount: true
          }
        }
      },
      take: 20
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get('/api/trade-ads', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      series,
      condition,
      region, // ← Фильтр по региону пользователя
      search,
      sort = 'newest'
    } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    let whereClause: any = {
      status: 'ACTIVE'
    };
    
    if (series && series !== 'ALL') {
      whereClause.figurine = {
        series: series as string
      };
    }
    
    if (condition && condition !== 'ALL') {
      whereClause.condition = condition;
    }
    
    if (region && region !== 'ALL') {
      // Фильтруем по региону пользователя, а не по location объявления
      whereClause.user = {
        region: region as string
      };
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { figurine: { name: { contains: search as string, mode: 'insensitive' } } },
        { location: { contains: search as string, mode: 'insensitive' } } // ← Ищем также в location
      ];
    }
    
    // Настройка сортировки
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'condition') {
      // Сортировка по условию (нужна кастомная логика на клиенте или сервере)
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'series') {
      orderBy = { figurine: { series: 'asc' } };
    }
    
    const [ads, total] = await prisma.$transaction([
      prisma.tradeAd.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              region: true, // ← Включаем регион пользователя
              profile: {
                select: {
                  avatar: true,
                  rating: true
                }
              }
            }
          },
          figurine: {
            select: {
              name: true,
              series: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy
      }),
      prisma.tradeAd.count({ where: whereClause })
    ]);
    
    const pages = Math.ceil(total / Number(limit));
    
    // Если сортировка по condition - обрабатываем на сервере
    let sortedAds = ads;
    if (sort === 'condition') {
      const conditionOrder = { MINT: 4, NIB: 3, GOOD: 2, TLC: 1 };
      sortedAds = ads.sort((a, b) => 
        (conditionOrder[b.condition as keyof typeof conditionOrder] || 0) - 
        (conditionOrder[a.condition as keyof typeof conditionOrder] || 0)
      );
    }
    
    res.json({
      ads: sortedAds,
      total,
      page: Number(page),
      pages,
      limit: Number(limit)
    });
  } catch (error: any) {
    console.error('Error fetching trade ads:', error);
    res.status(500).json({ error: error.message });
  }
});


// Получить мои объявления
app.get('/api/trade-ads/my', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const ads = await prisma.tradeAd.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            region: true, // Добавляем регион пользователя
            profile: {
              select: {
                avatar: true,
                rating: true
              }
            }
          }
        },
        figurine: {
          select: {
            name: true,
            series: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(ads);
  } catch (error: any) {
    console.error('Error fetching my trade ads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Создать новое объявление
app.post('/api/trade-ads', uploadTradeAds.single('photo'), async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { title, description, condition, location, figurineId } = req.body;
    
    // Валидация
    if (!title || !description || !condition || !location || !figurineId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Photo is required' });
    }
    
    // Находим фигурку
    const figurine = await prisma.figurine.findUnique({
      where: { id: figurineId }
    });
    
    if (!figurine) {
      return res.status(404).json({ error: 'Figurine not found' });
    }
    
    // Получаем пользователя (регион берется из его профиля)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { region: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Проверяем, указан ли у пользователя регион
    if (!user.region) {
      return res.status(400).json({ 
        error: 'Please set your region in profile settings before creating trade ads' 
      });
    }
    
    const ad = await prisma.tradeAd.create({
      data: {
        title,
        description,
        condition,
        location, // ← Конкретное местоположение
        photo: `/uploads/trade-ads/${req.file.filename}`,
        userId,
        figurineId,
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            region: true, // ← Регион пользователя
            profile: {
              select: {
                avatar: true,
                rating: true
              }
            }
          }
        },
        figurine: {
          select: {
            name: true,
            series: true
          }
        }
      }
    });
    
    res.json(ad);
  } catch (error: any) {
    console.error('Error creating trade ad:', error);
    res.status(500).json({ error: error.message });
  }
});

// Обновить объявление
app.put('/api/trade-ads/:id', uploadTradeAds.single('photo'), async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const adId = req.params.id;
    
    // Проверяем, что объявление принадлежит пользователю
    const existingAd = await prisma.tradeAd.findFirst({
      where: { id: adId, userId }
    });
    
    if (!existingAd) {
      return res.status(404).json({ error: 'Ad not found or you are not the owner' });
    }
    
    const { title, description, condition, location, figurineId } = req.body;
    
    const updateData: any = {
      title,
      description,
      condition,
      location,
      figurineId
    };
    
    // Если загружено новое фото
    if (req.file) {
      updateData.photo = `/uploads/trade-ads/${req.file.filename}`;
      // Удаляем старое фото (опционально)
      if (existingAd.photo.startsWith('/uploads/')) {
        const oldPath = `.${existingAd.photo}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }
    
    const updatedAd = await prisma.tradeAd.update({
      where: { id: adId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            region: true, // Добавляем регион пользователя
            profile: {
              select: {
                avatar: true,
                rating: true
              }
            }
          }
        },
        figurine: {
          select: {
            name: true,
            series: true
          }
        }
      }
    });
    
    res.json(updatedAd);
  } catch (error: any) {
    console.error('Error updating trade ad:', error);
    res.status(500).json({ error: error.message });
  }
});

// Удалить объявление
app.delete('/api/trade-ads/:id', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const adId = req.params.id;
    
    // Проверяем, что объявление принадлежит пользователю
    const existingAd = await prisma.tradeAd.findFirst({
      where: { id: adId, userId }
    });
    
    if (!existingAd) {
      return res.status(404).json({ error: 'Ad not found or you are not the owner' });
    }
    
    // Удаляем фото (опционально)
    if (existingAd.photo.startsWith('/uploads/')) {
      const filePath = `.${existingAd.photo}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await prisma.tradeAd.delete({
      where: { id: adId }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting trade ad:', error);
    res.status(500).json({ error: error.message });
  }
});

// Эндпоинты для wishlist
// Эндпоинт для получения вишлиста пользователя с полными данными фигурок
app.get('/api/wishlist/me', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        figurine: {
          select: {
            id: true,
            number: true,
            name: true,
            mold: true,
            series: true,
            rarity: true,
            year: true,
            description: true,
            imageUrl: true,
            verified: true
          }
        }
      },
      orderBy: { addedAt: 'desc' }
    });
    
    res.json(wishlistItems);
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/wishlist', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { figurineId, note, priority } = req.body;
    
    // Проверяем, не добавлена ли уже фигурка
    const existingItem = await prisma.wishlistItem.findFirst({
      where: { userId, figurineId }
    });
    
    if (existingItem) {
      return res.status(400).json({ error: 'Figurine already in wishlist' });
    }
    
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        figurineId,
        note,
        priority: priority || 1
      },
      include: {
        figurine: {
          select: {
            id: true,
            number: true,
            name: true,
            imageUrl: true,
          }
        }
      }
    });
    
    res.json(wishlistItem);
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/wishlist/:id', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const itemId = req.params.id;
    const { note, priority } = req.body;
    
    // Проверяем, что элемент принадлежит пользователю
    const existingItem = await prisma.wishlistItem.findFirst({
      where: { id: itemId, userId }
    });
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    
    const updatedItem = await prisma.wishlistItem.update({
      where: { id: itemId },
      data: {
        note,
        priority
      },
      include: {
        figurine: {
          select: {
            id: true,
            number: true,
            name: true,
            imageUrl: true,
          }
        }
      }
    });
    
    res.json(updatedItem);
  } catch (error: any) {
    console.error('Error updating wishlist item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/wishlist/:id', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const itemId = req.params.id;
    
    // Проверяем, что элемент принадлежит пользователю
    const existingItem = await prisma.wishlistItem.findFirst({
      where: { id: itemId, userId }
    });
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    
    await prisma.wishlistItem.delete({
      where: { id: itemId }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting wishlist item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/wishlist/status/:figurineId', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const figurineId = req.params.figurineId;
    
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: { userId, figurineId }
    });
    
    res.json({
      inWishlist: !!wishlistItem,
      note: wishlistItem?.note
    });
  } catch (error: any) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Добавим статическую папку для загрузок
app.use('/uploads', express.static('uploads'));

// Получить профиль пользователя по ID
app.get('/api/users/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        ratingsReceived: {
          include: {
            rater: {
              include: {
                profile: true
              }
            },
            trade: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Обновить профиль пользователя
app.put('/api/profile', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { 
      username, 
      bio, 
      location, 
      avatar, 
      region,
      achievements 
    } = req.body;
    
    // Получаем текущий профиль
    const currentProfile = await prisma.profile.findUnique({
      where: { userId }
    });
    
    // Проверяем, есть ли уже ачивка "Profile Customizer"
    let updatedAchievements = currentProfile?.achievements || [];
    const hasProfileCustomizer = updatedAchievements.includes('Profile Customizer');
    
    // Добавляем ачивку, если это первое обновление профиля
    if (!hasProfileCustomizer) {
      updatedAchievements.push('Profile Customizer');
    }
    
    // Если переданы дополнительные ачивки, добавляем их
    if (achievements && Array.isArray(achievements)) {
      achievements.forEach((achievement: string) => {
        if (!updatedAchievements.includes(achievement)) {
          updatedAchievements.push(achievement);
        }
      });
    }
    
    // Обновляем пользователя (если есть изменения)
    if (username || region) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(username && { username }),
          ...(region && { region })
        }
      });
    }
    
    // Обновляем профиль
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(bio && { bio }),
        ...(location && { location }),
        ...(avatar && { avatar }),
        achievements: updatedAchievements
      }
    });
    
    // Получаем обновленного пользователя
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    
    // Проверяем, заслужил ли пользователь знак доверия
    let hasTrustBadge = false;
    if (updatedUser?.profile?.tradeCount && updatedUser.profile.tradeCount >= 5 && 
        updatedUser.profile.rating && updatedUser.profile.rating >= 4.0) {
      // Добавляем ачивку Trusted Collector, если еще нет
      if (!updatedAchievements.includes('Trusted Collector')) {
        updatedAchievements.push('Trusted Collector');
        await prisma.profile.update({
          where: { userId },
          data: { achievements: updatedAchievements }
        });
      }
      hasTrustBadge = true;
    }
    
    res.json({
      success: true,
      user: updatedUser,
      profile: updatedProfile,
      hasTrustBadge,
      newAchievement: !hasProfileCustomizer ? 'Profile Customizer' : null
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Загрузить аватар
app.post('/api/profile/avatar', uploadAvatars.single('avatar'), async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Обновляем профиль с новым аватаром
    await prisma.profile.update({
      where: { userId },
      data: { avatar: avatarUrl }
    });
    
    // Получаем обновленного пользователя с профилем
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        profile: true 
      }
    });
    
    res.json({ 
      success: true, 
      avatarUrl,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получить wishlist пользователя
app.get('/api/users/:id/wishlist', async (req, res) => {
  try {
    const { id } = req.params;
    
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: id },
      include: {
        figurine: true
      },
      orderBy: { addedAt: 'desc' },
      take: 6 // Ограничиваем для предпросмотра
    });
    
    res.json(wishlistItems);
  } catch (error: any) {
    console.error('Error fetching user wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получить trade ads пользователя
app.get('/api/users/:id/trade-ads', async (req, res) => {
  try {
    const { id } = req.params;
    
    const ads = await prisma.tradeAd.findMany({
      where: { 
        userId: id,
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            region: true,
            profile: {
              select: {
                avatar: true,
                rating: true
              }
            }
          }
        },
        figurine: {
          select: {
            name: true,
            series: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 6 // Ограничиваем для предпросмотра
    });
    
    res.json(ads);
  } catch (error: any) {
    console.error('Error fetching user trade ads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получить чаты пользователя
app.get('/api/chats', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    // Находим все чаты, где пользователь участник
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        },
        receiver: {
          include: {
            profile: true
          }
        },
        trade: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Группируем сообщения по собеседнику
    const chatMap = new Map();
    
    messages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          id: otherUserId,
          otherUser: {
            id: otherUser.id,
            username: otherUser.username,
            profile: otherUser.profile,
            region: otherUser.region
          },
          lastMessage: msg,
          tradeAd: msg.trade,
          unreadCount: 0 // Рассчитываем непрочитанные
        });
      }
    });
    
    const chats = Array.from(chatMap.values());
    
    // Сортируем по времени последнего сообщения
    chats.sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
    
    res.json(chats);
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получить сообщения чата
app.get('/api/chats/:chatId/messages', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    const chatId = req.params.chatId; // ID другого пользователя
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: chatId },
          { senderId: chatId, receiverId: userId }
        ]
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        },
        trade: true
      },
      orderBy: { createdAt: 'asc' },
      take: 100 // Лимит сообщений
    });
    
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Отправить сообщение
app.post('/api/messages', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { receiverId, content, tradeId } = req.body;
    
    // Создаем сообщение
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content,
        tradeId,
        isRead: false
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        }
      }
    });
    
    res.json(message);
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Отправить trade offer
app.post('/api/trade-offers', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { tradeAdId, message } = req.body;
    
    // Создаем trade offer
    const tradeOffer = await prisma.tradeOffer.create({
      data: {
        tradeAdId,
        userId,
        message,
        status: 'PENDING'
      }
    });
    
    res.json(tradeOffer);
  } catch (error: any) {
    console.error('Error creating trade offer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Принять trade
app.post('/api/trades/:id/accept', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const tradeId = req.params.id;
    
    // Обновляем статус trade offer
    const tradeOffer = await prisma.tradeOffer.updateMany({
      where: {
        tradeAdId: tradeId,
        userId: userId
      },
      data: {
        status: 'ACCEPTED'
      }
    });
    
    // Обновляем статус объявления
    const tradeAd = await prisma.tradeAd.update({
      where: { id: tradeId },
      data: { status: 'COMPLETED' }
    });
    
    res.json({ success: true, tradeAd });
  } catch (error: any) {
    console.error('Error accepting trade:', error);
    res.status(500).json({ error: error.message });
  }
});

// Отправить жалобу
app.post('/api/complaints', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { reportedUserId, reason, details, chatId } = req.body;
    
    // Здесь можно сохранить жалобу в отдельную таблицу
    // Пока просто логируем
    console.log('Complaint submitted:', {
      reporterId: userId,
      reportedUserId,
      reason,
      details,
      chatId,
      timestamp: new Date()
    });
    
    res.json({ success: true, message: 'Complaint submitted successfully' });
  } catch (error: any) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ error: error.message });
  }
});