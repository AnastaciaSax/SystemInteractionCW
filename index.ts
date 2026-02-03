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
import fileUpload from 'express-fileupload';

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
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true,
  createParentPath: true
}));

// Подключаем auth маршруты
app.use('/api/auth', authRoutes);

// Импортируем и подключаем маршруты чата
import chatRoutes from './routes/chat';
app.use('/api/chat', chatRoutes);

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
      region,
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
      whereClause.user = {
        region: region as string
      };
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { figurine: { name: { contains: search as string, mode: 'insensitive' } } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'condition') {
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
        skip,
        take: Number(limit),
        orderBy
      }),
      prisma.tradeAd.count({ where: whereClause })
    ]);
    
    const pages = Math.ceil(total / Number(limit));
    
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
    
    if (!title || !description || !condition || !location || !figurineId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Photo is required' });
    }
    
    const figurine = await prisma.figurine.findUnique({
      where: { id: figurineId }
    });
    
    if (!figurine) {
      return res.status(404).json({ error: 'Figurine not found' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { region: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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
        location,
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
    
    if (req.file) {
      updateData.photo = `/uploads/trade-ads/${req.file.filename}`;
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
    
    const existingAd = await prisma.tradeAd.findFirst({
      where: { id: adId, userId }
    });
    
    if (!existingAd) {
      return res.status(404).json({ error: 'Ad not found or you are not the owner' });
    }
    
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

// Wishlist эндпоинты
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
app.use('/uploads/trade-offers', express.static('uploads/trade-offers'));

// Профиль пользователя
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
    
    const currentProfile = await prisma.profile.findUnique({
      where: { userId }
    });
    
    let updatedAchievements = currentProfile?.achievements || [];
    const hasProfileCustomizer = updatedAchievements.includes('Profile Customizer');
    
    if (!hasProfileCustomizer) {
      updatedAchievements.push('Profile Customizer');
    }
    
    if (achievements && Array.isArray(achievements)) {
      achievements.forEach((achievement: string) => {
        if (!updatedAchievements.includes(achievement)) {
          updatedAchievements.push(achievement);
        }
      });
    }
    
    if (username || region) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(username && { username }),
          ...(region && { region })
        }
      });
    }
    
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(bio && { bio }),
        ...(location && { location }),
        ...(avatar && { avatar }),
        achievements: updatedAchievements
      }
    });
    
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    
    let hasTrustBadge = false;
    if (updatedUser?.profile?.tradeCount && updatedUser.profile.tradeCount >= 5 && 
        updatedUser.profile.rating && updatedUser.profile.rating >= 4.0) {
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
    
    await prisma.profile.update({
      where: { userId },
      data: { avatar: avatarUrl }
    });
    
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

app.get('/api/users/:id/wishlist', async (req, res) => {
  try {
    const { id } = req.params;
    
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: id },
      include: {
        figurine: true
      },
      orderBy: { addedAt: 'desc' },
      take: 6
    });
    
    res.json(wishlistItems);
  } catch (error: any) {
    console.error('Error fetching user wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

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
      take: 6
    });
    
    res.json(ads);
  } catch (error: any) {
    console.error('Error fetching user trade ads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Эндпоинт для добавления отзыва и обновления рейтинга
app.post('/api/ratings', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { ratedUserId, tradeId, score, comment } = req.body;
    
    // Создаем отзыв
    const rating = await prisma.rating.create({
      data: {
        userId: ratedUserId,
        raterId: userId,
        tradeId,
        score,
        comment
      },
      include: {
        rater: {
          include: {
            profile: true
          }
        }
      }
    });
    
    // Получаем все отзывы для пользователя
    const userRatings = await prisma.rating.findMany({
      where: { userId: ratedUserId }
    });
    
    // Рассчитываем новый средний рейтинг
    const averageRating = userRatings.reduce((sum, r) => sum + r.score, 0) / userRatings.length;
    
    // Обновляем рейтинг в профиле
    await prisma.profile.update({
      where: { userId: ratedUserId },
      data: { rating: averageRating }
    });
    
    res.json({
      success: true,
      rating,
      newAverageRating: averageRating
    });
  } catch (error: any) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: error.message });
  }
});

// Устаревшие эндпоинты чата - теперь используем отдельный роутер
// Оставляем для обратной совместимости
app.get('/api/chats', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
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
          unreadCount: 0
        });
      }
    });
    
    const chats = Array.from(chatMap.values());
    
    chats.sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
    
    res.json(chats);
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chats/:chatId/messages', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    const chatId = req.params.chatId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Разбираем chatId: userId-otherUserId-tradeId или userId-otherUserId
    const parts = chatId.split('-');
    let userId1, userId2, tradeId;
    
    if (parts.length === 3) {
      [userId1, userId2, tradeId] = parts;
    } else if (parts.length === 2) {
      [userId1, userId2] = parts;
    }
    
    // Проверяем, что текущий пользователь участвует в чате
    if (userId !== userId1 && userId !== userId2) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2, ...(tradeId && { tradeId }) },
          { senderId: userId2, receiverId: userId1, ...(tradeId && { tradeId }) }
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    // Переворачиваем порядок для правильного отображения (от старых к новым)
    const sortedMessages = messages.reverse();
    
    res.json(sortedMessages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { receiverId, content, tradeId } = req.body;
    
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

app.post('/api/trade-offers', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { tradeAdId, message } = req.body;
    
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

app.post('/api/trades/:id/accept', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const tradeId = req.params.id;
    
    const tradeOffer = await prisma.tradeOffer.updateMany({
      where: {
        tradeAdId: tradeId,
        userId: userId
      },
      data: {
        status: 'ACCEPTED'
      }
    });
    
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

app.post('/api/complaints', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const { reportedUserId, reason, details, chatId } = req.body;
    
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