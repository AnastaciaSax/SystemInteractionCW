import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware для проверки административных прав
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.use(authenticate, requireAdmin);

// Статистика дашборда
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      userGrowth,
      activeTrades,
      tradeGrowth,
      totalArticles,
      articleGrowth,
      revenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.tradeAd.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.tradeAd.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.article.count(),
      prisma.article.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Пример расчета дохода (демо данные)
      Promise.resolve(4250)
    ]);

    res.json({
      totalUsers,
      userGrowth: ((userGrowth / totalUsers) * 100) || 0,
      activeTrades,
      tradeGrowth: ((tradeGrowth / activeTrades) * 100) || 0,
      totalArticles,
      articleGrowth: ((articleGrowth / totalArticles) * 100) || 0,
      revenue,
      revenueGrowth: 12.5 // Демо данные
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/activity/recent', async (req, res) => {
  try {
    // Получаем последних пользователей (без ограничения по дате)
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const recentTrades = await prisma.tradeAd.findMany({
      select: {
        id: true,
        title: true,
        condition: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const recentArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const activities: any[] = [
      ...recentUsers.map(u => ({
        type: 'USER_REGISTERED',
        entity_id: u.id,
        title: u.username,
        description: 'New user registered',
        details: u.email,
        timestamp: u.createdAt,
      })),
      ...recentTrades.map(t => ({
        type: 'TRADE_CREATED',
        entity_id: t.id,
        title: t.title,
        description: 'New trade ad created',
        details: t.condition,
        timestamp: t.createdAt,
      })),
      ...recentArticles.map(a => ({
        type: 'ARTICLE_PUBLISHED',
        entity_id: a.id,
        title: a.title,
        description: 'New article published',
        details: a.category,
        timestamp: a.createdAt,
      })),
    ];

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(activities.slice(0, 20));
  } catch (error: any) {
    console.error('Error in /activity/recent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Управление пользователями
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, isVerified, isActive } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(role && { role }),
        ...(isVerified !== undefined && { isVerified }),
        ...(isActive !== undefined && { isActive: isActive !== false })
      },
      include: { profile: true }
    });
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.$transaction([
      prisma.rating.deleteMany({
        where: {
          OR: [{ userId: id }, { raterId: id }]
        }
      }),
      prisma.tradeOffer.deleteMany({
        where: { userId: id }
      }),
      prisma.tradeAd.deleteMany({
        where: { userId: id }
      }),
      prisma.wishlistItem.deleteMany({
        where: { userId: id }
      }),
      prisma.message.deleteMany({
        where: {
          OR: [{ senderId: id }, { receiverId: id }]
        }
      }),
      prisma.article.deleteMany({
        where: { authorId: id }
      }),
      prisma.profile.deleteMany({
        where: { userId: id }
      }),
      prisma.user.delete({
        where: { id }
      })
    ]);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Управление статьями
router.get('/articles', async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(articles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/articles', async (req, res) => {
  try {
    const { title, content, category, tags, published, imageUrl } = req.body;
    const authorId = req.user.userId;
    
    const article = await prisma.article.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        published: published !== false,
        imageUrl: imageUrl || null,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, published, imageUrl } = req.body;
    
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(category && { category }),
        ...(tags && { tags }),
        ...(published !== undefined && { published }),
        ...(imageUrl !== undefined && { imageUrl })
      },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.article.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/export', async (req, res) => {
  try {
    const { type, format } = req.query;

    if (format !== 'pdf' && format !== 'csv') {
      return res.status(400).json({ error: 'Only PDF and CSV formats are supported' });
    }

    let data: any[] = [];
    let totals: any = {};
    let filename = `report-${type}-${new Date().toISOString().split('T')[0]}`;

    switch (type) {
      case 'users':
        data = await prisma.user.findMany({
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
            profile: {
              select: {
                tradeCount: true,
                rating: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        totals = {
          totalUsers: data.length,
          verifiedUsers: data.filter((u) => u.isVerified).length,
          totalTrades: data.reduce((sum, u) => sum + (u.profile?.tradeCount || 0), 0),
          avgRating:
            data.length > 0
              ? (
                  data.reduce((sum, u) => sum + (u.profile?.rating || 0), 0) / data.length
                ).toFixed(2)
              : 0,
        };
        break;

      case 'trades':
        data = await prisma.tradeAd.findMany({
          include: {
            user: { select: { username: true, email: true } },
            figurine: { select: { name: true, series: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
        totals = {
          totalTrades: data.length,
          active: data.filter((t) => t.status === 'ACTIVE').length,
          completed: data.filter((t) => t.status === 'COMPLETED').length,
          pending: data.filter((t) => t.status === 'PENDING').length,
          cancelled: data.filter((t) => t.status === 'CANCELLED').length,
        };
        break;

      case 'articles':
        data = await prisma.article.findMany({
          include: {
            author: { select: { username: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
        totals = {
          totalArticles: data.length,
          published: data.filter((a) => a.published).length,
          totalViews: data.reduce((sum, a) => sum + a.views, 0),
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      doc.pipe(res);

      // Заголовок
      doc.fontSize(20).font('Helvetica-Bold').text('Collector Mingle Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).font('Helvetica').text(`Report Type: ${type}`, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      // Итоги
      doc.fontSize(14).font('Helvetica-Bold').text('Summary', { underline: true });
      doc.fontSize(10).font('Helvetica');
      Object.entries(totals).forEach(([key, value]) => {
        doc.text(
          `${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: ${value}`
        );
      });
      doc.moveDown();

      // Детальные данные
      if (data.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Details', { underline: true });
        doc.moveDown();

        // Определяем заголовки (исключаем вложенные объекты)
        const sample = data[0];
        const headers = Object.keys(sample).filter(
          (key) => !['profile', 'user', 'figurine', 'author'].includes(key)
        );
        const columnWidth = 150;

        // Заголовки таблицы
        doc.fontSize(8).font('Helvetica-Bold');
        let y = doc.y;
        headers.forEach((header, i) => {
          doc.text(header, 50 + i * columnWidth, y, { width: columnWidth, align: 'left' });
        });
        doc.moveDown();
        doc.fontSize(7).font('Helvetica');

        // Строки
        data.forEach((item, index) => {
          let yPos = doc.y;
          headers.forEach((header, i) => {
            let value = item[header];
            if (header === 'createdAt') value = new Date(value).toLocaleDateString();
            if (header === 'profile') value = `Trades: ${item.profile?.tradeCount}, Rating: ${item.profile?.rating}`;
            if (header === 'user') value = item.user?.username || '';
            if (header === 'figurine') value = item.figurine?.name || '';
            if (header === 'author') value = item.author?.username || '';
            doc.text(String(value || ''), 50 + i * columnWidth, yPos, { width: columnWidth, align: 'left' });
          });
          doc.moveDown();
          if (doc.y > 700) {
            doc.addPage();
            y = 50;
          }
        });
      } else {
        doc.text('No data available.');
      }

      doc.end();
    } else if (format === 'csv') {
      if (data.length === 0) {
        return res.status(404).json({ error: 'No data to export' });
      }

      // Заголовки (плоские)
      const sample = data[0];
      const headers = Object.keys(sample).filter((key) => typeof sample[key] !== 'object');
      const csvRows = [];
      csvRows.push(headers.join(','));

      data.forEach((row) => {
        const values = headers.map((header) => {
          let val = row[header];
          if (header === 'createdAt') val = new Date(val).toLocaleDateString();
          if (val === null || val === undefined) val = '';
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        });
        csvRows.push(values.join(','));
      });

      // Итоговая строка
      const totalRow = headers.map((header) => {
        if (header === 'id' || header === 'username' || header === 'email' || header === 'role') return '';
        if (header === 'isVerified') return totals.verifiedUsers || '';
        if (header === 'tradeCount') return totals.totalTrades || '';
        if (header === 'rating') return totals.avgRating || '';
        if (header === 'status') return `Active:${totals.active || 0}`;
        return '';
      });
      csvRows.push(['TOTAL', ...totalRow.slice(1)].join(','));

      const csv = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csv);
    }
  } catch (error: any) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Загрузка изображений
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadDir = 'uploads/articles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'article-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/upload/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/articles/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить список фигурок с фильтрацией и пагинацией
router.get('/figurines', async (req, res) => {
  try {
    const { search, series, rarity, mold, page = 1, limit = 9 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { number: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (series && series !== 'ALL') where.series = series;
    if (rarity && rarity !== 'ALL') where.rarity = rarity;
    if (mold && mold !== 'ALL') where.mold = mold;

    const [figurines, total] = await prisma.$transaction([
      prisma.figurine.findMany({
        where,
        orderBy: { number: 'asc' },
        skip,
        take: Number(limit),
      }),
      prisma.figurine.count({ where }),
    ]);

    res.json({
      figurines,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить одну фигурку по ID
router.get('/figurines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const figurine = await prisma.figurine.findUnique({ where: { id } });
    if (!figurine) return res.status(404).json({ error: 'Figurine not found' });
    res.json(figurine);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создать новую фигурку
router.post('/figurines', async (req, res) => {
  try {
    const { number, name, mold, series, rarity, year, description, imageUrl, verified } = req.body;
    // Проверка уникальности номера
    const existing = await prisma.figurine.findUnique({ where: { number } });
    if (existing) return res.status(400).json({ error: 'Figurine with this number already exists' });
    
    const figurine = await prisma.figurine.create({
      data: {
        number,
        name,
        mold,
        series,
        rarity,
        year: parseInt(year),
        description,
        imageUrl,
        verified: verified || false,
      },
    });
    res.json(figurine);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить фигурку
router.put('/figurines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, name, mold, series, rarity, year, description, imageUrl, verified } = req.body;
    
    // Если меняется номер, проверяем уникальность
    if (number) {
      const existing = await prisma.figurine.findFirst({ where: { number, NOT: { id } } });
      if (existing) return res.status(400).json({ error: 'Figurine with this number already exists' });
    }
    
    const figurine = await prisma.figurine.update({
      where: { id },
      data: {
        number,
        name,
        mold,
        series,
        rarity,
        year: year ? parseInt(year) : undefined,
        description,
        imageUrl,
        verified,
      },
    });
    res.json(figurine);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить фигурку
router.delete('/figurines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.figurine.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Загрузка изображения для фигурки
const figurineStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadDir = 'uploads/figurines';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'figurine-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadFigurine = multer({ 
  storage: figurineStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/upload/figurine-image', uploadFigurine.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/figurines/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;