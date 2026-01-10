import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prisma/client';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Импорты должны быть вверху, перенесите их
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// Аутентификация и регистрация (оставьте как есть, но проверьте импорты)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, age, parentEmail, region } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        age: age ? parseInt(age) : null,
        parentEmail,
        region,
        profile: {
          create: {
            avatar: '/assets/default-avatar.png',
            bio: '',
            status: 'Beginner',
            achievements: [],
            tradeCount: 0
          }
        }
      },
      include: { profile: true }
    });
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Остальные эндпоинты (добавьте позже)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});