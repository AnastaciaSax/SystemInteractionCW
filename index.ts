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

// Настройка загрузки файлов
const storage = multer.diskStorage({
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

const upload = multer({ 
  storage,
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
      region,
      search
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
        { figurine: { name: { contains: search as string, mode: 'insensitive' } } }
      ];
    }
    
    const [ads, total] = await prisma.$transaction([
      prisma.tradeAd.findMany({
        where: whereClause,
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
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tradeAd.count({ where: whereClause })
    ]);
    
    const pages = Math.ceil(total / Number(limit));
    
    res.json({
      ads,
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
app.post('/api/trade-ads', upload.single('photo'), async (req: any, res) => {
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
    
    // Получаем пользователя для получения его региона
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { region: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
    
    res.json(ad);
  } catch (error: any) {
    console.error('Error creating trade ad:', error);
    res.status(500).json({ error: error.message });
  }
});

// Обновить объявление
app.put('/api/trade-ads/:id', upload.single('photo'), async (req: any, res) => {
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

// Добавим статическую папку для загрузок
app.use('/uploads', express.static('uploads'));