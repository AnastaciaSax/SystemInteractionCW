// server/src/routes/chat.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Добавляем интерфейс для типизации req.files
interface UploadedFile {
  name: string;
  mv: (path: string) => Promise<void>;
  mimetype: string;
  data: Buffer;
  size: number;
}

// Получение всех чатов для текущего пользователя
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

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
      orderBy: {
        createdAt: 'desc'
      }
    });

    const chatsMap = new Map();
    
    messages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      
      const chatKey = `${otherUserId}-${message.tradeId || 'no-trade'}`;
      
      if (!chatsMap.has(chatKey)) {
        chatsMap.set(chatKey, {
          id: chatKey,
          otherUser: {
            id: otherUser.id,
            username: otherUser.username,
            profile: otherUser.profile,
            region: otherUser.region
          },
          lastMessage: message,
          tradeAd: message.trade,
          unreadCount: 0,
          messages: []
        });
      }
      
      const chat = chatsMap.get(chatKey);
      chat.messages.push(message);
      
      if (!message.isRead && message.senderId !== userId) {
        chat.unreadCount++;
      }
    });

    const chats = Array.from(chatsMap.values()).map(chat => ({
      ...chat,
      lastMessage: chat.messages[0]
    }));

    res.json(chats);
  } catch (error: any) {
    console.error('Get chats error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to get chats' 
    });
  }
});

// Получение сообщений для конкретного чата
router.get('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;
    
    const [otherUserId, tradeId] = chatId.split('-');
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: otherUserId,
            ...(tradeId !== 'no-trade' && { tradeId })
          },
          {
            senderId: otherUserId,
            receiverId: userId,
            ...(tradeId !== 'no-trade' && { tradeId })
          }
        ]
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
    
    res.json(messages);
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to get messages' 
    });
  }
});

// Отправка сообщения
router.post('/send', authenticate, async (req, res) => {
  try {
    const { receiverId, content, tradeId } = req.body;
    const senderId = req.user.userId;
    
    if (!receiverId || !content) {
      return res.status(400).json({ 
        success: false,
        error: 'Receiver ID and content are required' 
      });
    }
    
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        tradeId: tradeId || null,
        content,
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
    
    res.json({
      success: true,
      message
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to send message' 
    });
  }
});

// Отправка trade offer (с изображением)
router.post('/trade-offer', authenticate, async (req: any, res) => {
  try {
    const { tradeAdId, textMessage } = req.body;
    const userId = req.user.userId;
    
    if (!tradeAdId) {
      return res.status(400).json({ 
        success: false,
        error: 'Trade Ad ID is required' 
      });
    }
    
    // Проверяем наличие файла
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false,
        error: 'Image file is required' 
      });
    }
    
    const imageFile = req.files.image as UploadedFile;
    
    // Создаем директорию для trade offers, если не существует
    const uploadDir = path.join(__dirname, '../../uploads/trade-offers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Сохраняем файл
    const fileName = `trade-offer-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(imageFile.name || '.jpg')}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Используем mv() для сохранения файла
    await imageFile.mv(filePath);
    
    const imageUrl = `/uploads/trade-offers/${fileName}`;
    
    // Создаем trade offer с путем к фото в поле message
    const tradeOffer = await prisma.tradeOffer.create({
      data: {
        tradeAdId,
        userId,
        message: imageUrl, // Сохраняем путь к фото здесь
        status: 'PENDING'
      }
    });
    
    // Получаем информацию о торговом объявлении
    const tradeAd = await prisma.tradeAd.findUnique({
      where: { id: tradeAdId },
      include: {
        user: true
      }
    });
    
    if (!tradeAd) {
      return res.status(404).json({ 
        success: false,
        error: 'Trade ad not found' 
      });
    }
    
    // Создаем сообщение о trade offer с текстом
    const chatMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: tradeAd.userId,
        tradeId: tradeAdId,
        content: textMessage || 'Check out my trade offer!',
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
    
    res.json({
      success: true,
      tradeOffer,
      message: {
        ...chatMessage,
        imageUrl: imageUrl
      }
    });
  } catch (error: any) {
    console.error('Send trade offer error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to send trade offer' 
    });
  }
});

// Принятие/отклонение trade offer
router.post('/trade-offer/:offerId/accept', authenticate, async (req, res) => {
  try {
    const { offerId } = req.params;
    const { accept } = req.body;
    
    const tradeOffer = await prisma.tradeOffer.update({
      where: { id: offerId },
      data: {
        status: accept ? 'ACCEPTED' : 'REJECTED'
      },
      include: {
        tradeAd: true,
        user: true
      }
    });
    
    if (accept) {
      await prisma.tradeAd.update({
        where: { id: tradeOffer.tradeAdId },
        data: {
          status: 'PENDING'
        }
      });
    }
    
    const notificationMessage = await prisma.message.create({
      data: {
        senderId: tradeOffer.tradeAd.userId,
        receiverId: tradeOffer.userId,
        tradeId: tradeOffer.tradeAdId,
        content: accept 
          ? `Trade offer accepted! Let's finalize the details.` 
          : `Trade offer declined. Maybe next time!`,
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
    
    res.json({
      success: true,
      tradeOffer,
      message: notificationMessage
    });
  } catch (error: any) {
    console.error('Accept trade offer error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to process trade offer' 
    });
  }
});

// Завершение сделки
router.post('/trade/:tradeId/finish', authenticate, async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;
    
    const tradeAd = await prisma.tradeAd.findUnique({
      where: { id: tradeId },
      include: {
        user: true
      }
    });
    
    if (!tradeAd) {
      return res.status(404).json({ 
        success: false,
        error: 'Trade ad not found' 
      });
    }
    
    const ratedUserId = tradeAd.userId === userId ? 
      (await prisma.tradeOffer.findFirst({
        where: { tradeAdId: tradeId, status: 'ACCEPTED' },
        select: { userId: true }
      }))?.userId : tradeAd.userId;
    
    if (!ratedUserId) {
      return res.status(400).json({ 
        success: false,
        error: 'Could not determine user to rate' 
      });
    }
    
    const ratingRecord = await prisma.rating.create({
      data: {
        userId: ratedUserId,
        raterId: userId,
        tradeId,
        score: rating || 5,
        comment: comment || ''
      }
    });
    
    await prisma.tradeAd.update({
      where: { id: tradeId },
      data: {
        status: 'COMPLETED'
      }
    });
    
    await prisma.profile.update({
      where: { userId: ratedUserId },
      data: {
        tradeCount: { increment: 1 }
      }
    });
    
    res.json({
      success: true,
      rating: ratingRecord
    });
  } catch (error: any) {
    console.error('Finish trade error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to finish trade' 
    });
  }
});

// Отправка жалобы
router.post('/complaint', authenticate, async (req, res) => {
  try {
    const { reportedUserId, reason, details, chatId } = req.body;
    const reporterId = req.user.userId;
    
    if (!reportedUserId || !reason) {
      return res.status(400).json({ 
        success: false,
        error: 'Reported user ID and reason are required' 
      });
    }
    
    console.log('COMPLAINT SUBMITTED:', {
      reportedUserId,
      reporterId,
      reason,
      details,
      chatId,
      timestamp: new Date().toISOString()
    });
    
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (admin) {
      await prisma.message.create({
        data: {
          senderId: reporterId,
          receiverId: admin.id,
          content: `New complaint submitted: ${reason}. Details: ${details}`,
          isRead: false
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Complaint submitted successfully'
    });
  } catch (error: any) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to submit complaint' 
    });
  }
});

export default router;