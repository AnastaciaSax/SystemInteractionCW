import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    verificationCodes.set(email, { code, expiresAt });

    console.log(`🔐 Verification code for ${email}: ${code}`);
    console.log(`📝 Code expires at: ${new Date(expiresAt).toLocaleTimeString()}`);

    res.json({
      success: true,
      message: 'Verification code sent successfully',
      demoCode: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error: any) {
    console.error('Send verification error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

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

    verificationCodes.delete(email);

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

export default router;