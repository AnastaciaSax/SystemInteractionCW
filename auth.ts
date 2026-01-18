import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const verificationCodes = new Map<string, { 
  code: string; 
  expiresAt: number; 
  verified?: boolean;
}>();

const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Эндпоинт для отправки кода верификации
router.post('/send-verification', async (req, res) => {
  try {
    console.log('🔍 Received request body:', req.body);
    const { email } = req.body;
    
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    console.log(`🔍 Looking for user with email: ${email}`);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      console.log(`❌ User already exists: ${email}`);
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 минут

    verificationCodes.set(email, { code, expiresAt });

    console.log(`🔐 Verification code for ${email}: ${code}`);
    console.log(`📝 Code expires at: ${new Date(expiresAt).toLocaleTimeString()}`);

    res.json({
      success: true,
      message: 'Verification code sent successfully',
      demoCode: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error: any) {
    console.error('❌ Send verification error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Эндпоинт для проверки кода
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and code are required' 
      });
    }

    const stored = verificationCodes.get(email);
    
    if (!stored) {
      return res.status(400).json({ 
        success: false,
        message: 'No verification code found for this email' 
      });
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({ 
        success: false,
        message: 'Verification code has expired' 
      });
    }

    if (stored.code !== code) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid verification code' 
      });
    }

    // ОТМЕЧАЕМ КАК ВЕРИФИЦИРОВАННЫЙ
    verificationCodes.set(email, { 
      ...stored, 
      verified: true 
    });

    console.log(`✅ Email ${email} verified successfully!`);

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    console.error('Verify code error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Эндпоинт для проверки, верифицирован ли email перед регистрацией
router.post('/check-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        message: 'Email is required' 
      });
    }

    const stored = verificationCodes.get(email);
    const isVerified = stored && stored.verified === true;
    
    res.json({
      success: true,
      verified: isVerified,
      message: isVerified ? 'Email is verified' : 'Email is not verified'
    });
  } catch (error: any) {
    console.error('Check verification error:', error);
    res.status(500).json({ 
      success: false,
      verified: false,
      message: error.message 
    });
  }
});

// Аутентификация и регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, age, parentEmail, region, role = 'USER' } = req.body;
    
    // Проверка на уникальность email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User with this email already exists' 
      });
    }

    let isEmailVerified = false;
    const stored = verificationCodes.get(email);
    
    // Для демо-режима: если в development, всегда true
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 Development mode: auto-verifying email ${email}`);
      isEmailVerified = true; // ← ВАЖНО: установите true
    } else {
      isEmailVerified = stored?.verified === true;
      if (!isEmailVerified) {
        return res.status(400).json({ 
          success: false,
          error: 'Email must be verified before registration' 
        });
      }
    }

    // Удаляем код верификации после успешной регистрации
    verificationCodes.delete(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role || 'USER',
        age: age ? parseInt(age) : null,
        parentEmail,
        region,
        isVerified: isEmailVerified, // ← Теперь будет true в development
        profile: {
          create: {
            avatar: '/assets/default-avatar.png',
            bio: '',
            status: role === 'ADMIN' ? 'Administrator' : 'Beginner',
            achievements: role === 'ADMIN' ? ['Administrator'] : ['New Member'],
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
        age: user.age,
        parentEmail: user.parentEmail,
        region: user.region,
        isVerified: user.isVerified,
        profile: user.profile
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Registration failed' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
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
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Login failed' 
    });
  }
});

export default router;