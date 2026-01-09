
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});