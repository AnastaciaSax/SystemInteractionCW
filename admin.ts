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

// Недавняя активность
router.get('/activity/recent', async (req, res) => {
  try {
    const activities = await prisma.$queryRaw`
      SELECT 
        'USER_REGISTERED' as type,
        id as entity_id,
        username as title,
        'New user registered' as description,
        email as details,
        created_at as timestamp
      FROM "User"
      WHERE created_at >= NOW() - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'TRADE_CREATED' as type,
        id as entity_id,
        title,
        'New trade ad created' as description,
        condition as details,
        created_at as timestamp
      FROM "TradeAd"
      WHERE created_at >= NOW() - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'ARTICLE_PUBLISHED' as type,
        id as entity_id,
        title,
        'New article published' as description,
        category as details,
        created_at as timestamp
      FROM "Article"
      WHERE created_at >= NOW() - INTERVAL '7 days'
      
      ORDER BY timestamp DESC
      LIMIT 20
    `;
    
    res.json(activities);
  } catch (error: any) {
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

// Экспорт отчетов
router.get('/reports/export', async (req, res) => {
  try {
    const { type, format } = req.query;
    
    let data: any[] = [];
    let filename = `report-${type}`;
    
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
                rating: true
              }
            }
          }
        });
        break;
        
      case 'trades':
        data = await prisma.tradeAd.findMany({
          include: {
            user: {
              select: {
                username: true,
                email: true
              }
            },
            figurine: true
          }
        });
        break;
        
      case 'articles':
        data = await prisma.article.findMany({
          include: {
            author: {
              select: {
                username: true
              }
            }
          }
        });
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }
    
    if (format === 'pdf') {
      const doc = new PDFDocument();
      
      // Настраиваем заголовки для response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      
      // Создаем PDF
      doc.pipe(res);
      
      doc.fontSize(25).text('Collector Mingle Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Report Type: ${type}`, { align: 'center' });
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();
      
      // Добавляем данные
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        let yPosition = doc.y;
        
        headers.forEach(header => {
          doc.fontSize(10).text(header, 50, yPosition, { width: 150 });
          yPosition += 20;
        });
        
        doc.moveDown();
        
        data.forEach((item: any, index: number) => {
          yPosition = doc.y;
          headers.forEach(header => {
            const value = item[header] ? String(item[header]) : '';
            doc.fontSize(8).text(value, 50, yPosition, { width: 150 });
            yPosition += 15;
          });
          doc.moveDown();
        });
      }
      
      doc.end();
      
    } else if (format === 'csv') {
      if (data.length === 0) {
        return res.status(404).json({ error: 'No data to export' });
      }
      
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map((row: any) =>
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
          }).join(',')
        )
      ];
      
      const csv = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csv);
      
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');
      
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);
        
        data.forEach((item: any) => {
          const row = headers.map(header => item[header]);
          worksheet.addRow(row);
        });
      }
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      
      await workbook.xlsx.write(res);
      res.end();
      
    } else {
      res.status(400).json({ error: 'Invalid format' });
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

export default router;