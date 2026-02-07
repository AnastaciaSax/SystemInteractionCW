// server/src/routes/chat.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

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
router.get('/', async (req: any, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Получаем все чаты пользователя
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          include: { profile: true }
        },
        receiver: {
          include: { profile: true }
        },
        trade: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Группируем сообщения по чатам
    const chatsMap = new Map();

    messages.forEach(msg => {
      // Определяем ID чата
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const sortedIds = [userId, otherUserId].sort();
      const chatId = msg.tradeId 
        ? `${sortedIds[0]}-${sortedIds[1]}-${msg.tradeId}`
        : `${sortedIds[0]}-${sortedIds[1]}`;

      if (!chatsMap.has(chatId)) {
        // Проверяем, есть ли в сообщениях этого чата принятый трейд-оффер
        const chatMessages = messages.filter(m => {
          const mOtherUserId = m.senderId === userId ? m.receiverId : m.senderId;
          const mSortedIds = [userId, mOtherUserId].sort();
          const mChatId = m.tradeId 
            ? `${mSortedIds[0]}-${mSortedIds[1]}-${m.tradeId}`
            : `${mSortedIds[0]}-${mSortedIds[1]}`;
          return mChatId === chatId;
        });

        const hasAcceptedTradeOffer = chatMessages.some(m => 
          m.content.startsWith('[TRADE_OFFER]') && 
          m.content.includes('|ACCEPTED')
        );

        chatsMap.set(chatId, {
          id: chatId,
          otherUser: msg.senderId === userId ? msg.receiver : msg.sender,
          tradeAd: msg.trade ? {
            id: msg.trade.id,
            title: msg.trade.title,
            status: msg.trade.status, // Оставляем оригинальный статус из БД
            photo: msg.trade.photo,
            userId: msg.trade.userId
          } : undefined,
unreadCount: chatMessages.filter(m => 
  m.receiverId === userId && !m.isRead
).length
        });
      }
    });

    const chats = Array.from(chatsMap.values());
    
    res.json(chats);
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Отправка trade offer (ТОЛЬКО фото)
router.post('/trade-offer', authenticate, async (req: any, res) => {
  try {
    const { tradeAdId } = req.body;
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
    
    await imageFile.mv(filePath);
    
    const imageUrl = `/uploads/trade-offers/${fileName}`;
    
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
    
    // Проверяем, не является ли пользователь владельцем объявления
    if (tradeAd.userId === userId) {
      return res.status(400).json({ 
        success: false,
        error: 'You cannot send trade offer to your own ad' 
      });
    }
    
    // Создаем trade offer
    const tradeOffer = await prisma.tradeOffer.create({
      data: {
        tradeAdId,
        userId,
        message: imageUrl, // Сохраняем путь к фото как сообщение
        status: 'PENDING'
      }
    });
    
    // Создаем сообщение в чате - сохраняем URL в content
const chatMessage = await prisma.message.create({
  data: {
    senderId: userId,
    receiverId: tradeAd.userId,
    tradeId: tradeAdId,
    content: `[TRADE_OFFER]${imageUrl}|${tradeOffer.id}`, // Добавляем ID trade offer
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
    
    // Обновляем статус объявления на PENDING
    await prisma.tradeAd.update({
      where: { id: tradeAdId },
      data: { status: 'PENDING' }
    });
    
    res.json({
      success: true,
      tradeOffer,
      message: chatMessage
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
    const userId = req.user.userId;
    
    console.log('Accepting trade offer:', { offerId, accept, userId });
    
    // Получаем trade offer
    const tradeOffer = await prisma.tradeOffer.findUnique({
      where: { id: offerId },
      include: {
        tradeAd: true,
        user: true
      }
    });
    
    if (!tradeOffer) {
      return res.status(404).json({ 
        success: false,
        error: 'Trade offer not found' 
      });
    }
    
    // Проверяем, имеет ли пользователь право принимать/отклонять
    if (tradeOffer.tradeAd.userId !== userId) {
      return res.status(403).json({ 
        success: false,
        error: 'You are not authorized to accept/reject this offer' 
      });
    }
    
    // Обновляем статус trade offer
    const updatedTradeOffer = await prisma.tradeOffer.update({
      where: { id: offerId },
      data: {
        status: accept ? 'ACCEPTED' : 'REJECTED'
      }
    });
    
    // Обновляем статус объявления
    const newStatus = accept ? 'PENDING' : 'ACTIVE';
    await prisma.tradeAd.update({
      where: { id: tradeOffer.tradeAdId },
      data: { status: newStatus }
    });
    
    // Создаем уведомление для отправителя предложения
    const notificationMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: tradeOffer.userId,
        tradeId: tradeOffer.tradeAdId,
        content: accept 
          ? `Your trade offer has been accepted! Let's finalize the details.` 
          : `Your trade offer has been declined. Maybe next time!`,
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
    
    // Обновляем существующее сообщение с trade offer, чтобы добавить статус
    const existingMessage = await prisma.message.findFirst({
      where: {
        content: { contains: offerId }
      }
    });
    
    if (existingMessage) {
      // Обновляем content, добавляя статус
      const updatedContent = existingMessage.content.includes('|ACCEPTED') || existingMessage.content.includes('|REJECTED')
        ? existingMessage.content
        : `${existingMessage.content}|${accept ? 'ACCEPTED' : 'REJECTED'}`;
      
      await prisma.message.update({
        where: { id: existingMessage.id },
        data: { content: updatedContent }
      });
    }
    
    res.json({
      success: true,
      tradeOffer: updatedTradeOffer,
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

// Отправка жалобы и отмена сделки
router.post('/complaint', authenticate, async (req, res) => {
  try {
    const { reportedUserId, reason, details, chatId, tradeId } = req.body;
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
      tradeId,
      timestamp: new Date().toISOString()
    });
    
    // Если есть tradeId, отменяем объявление
    if (tradeId) {
      await prisma.tradeAd.update({
        where: { id: tradeId },
        data: { status: 'CANCELLED' }
      });
      
      // Находим все активные trade offers для этого объявления и отменяем их
      await prisma.tradeOffer.updateMany({
        where: { 
          tradeAdId: tradeId,
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });
    }
    
    // Уведомляем админа
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (admin) {
      await prisma.message.create({
        data: {
          senderId: reporterId,
          receiverId: admin.id,
          content: `COMPLAINT: ${reason}. Details: ${details}. Trade: ${tradeId || 'N/A'}`,
          isRead: false
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Complaint submitted successfully. Trade has been cancelled if applicable.'
    });
  } catch (error: any) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to submit complaint' 
    });
  }
});

router.get('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const userId = req.user.userId;

    console.log('Fetching messages for chatId:', chatId); // Добавьте для отладки
    
    // Разбираем chatId: userId-otherUserId-tradeId или userId-otherUserId
    const parts = chatId.split('-');
    if (parts.length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid chat ID format. Expected: userId-otherUserId or userId-otherUserId-tradeId' 
      });
    }

    let userId1, userId2, tradeId;
    
    if (parts.length === 3) {
      [userId1, userId2, tradeId] = parts;
    } else if (parts.length === 2) {
      [userId1, userId2] = parts;
      tradeId = null;
    } else {
      // Если частей больше 3 (например, когда tradeId содержит дефисы)
      userId1 = parts[0];
      userId2 = parts[1];
      tradeId = parts.slice(2).join('-'); // Собираем оставшиеся части как tradeId
    }

    console.log('Parsed chat parts:', { userId1, userId2, tradeId }); // Добавьте для отладки

    // Проверяем, что текущий пользователь участвует в чате
    if (userId !== userId1 && userId !== userId2) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. You are not part of this chat.' 
      });
    }

    // Строим условие WHERE
    const whereClause: any = {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    };

    // Добавляем tradeId в условие, если он есть
    if (tradeId && tradeId !== 'undefined') {
      whereClause.tradeId = tradeId;
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    console.log(`Found ${messages.length} messages for chat ${chatId}`); // Добавьте для отладки

    // Переворачиваем порядок для правильного отображения (от старых к новым)
    const sortedMessages = messages.reverse();

    res.json(sortedMessages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch messages' 
    });
  }
});

router.get('/ensure/:tradeAdId/:otherUserId', authenticate, async (req, res) => {
  try {
    const { tradeAdId, otherUserId } = req.params;
    const userId = req.user.userId;
    
    // Проверяем, есть ли уже сообщения между этими пользователями по этому объявлению
    const existingMessages = await prisma.message.findMany({
      where: {
        OR: [
          { 
            senderId: userId, 
            receiverId: otherUserId,
            tradeId: tradeAdId 
          },
          { 
            senderId: otherUserId, 
            receiverId: userId,
            tradeId: tradeAdId 
          }
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
      orderBy: { createdAt: 'desc' },
      take: 1
    });
    
    if (existingMessages.length > 0) {
      // Чат уже существует
      const message = existingMessages[0];
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      
      const sortedIds = [userId, otherUserId].sort();
      const chatId = tradeAdId 
        ? `${sortedIds[0]}-${sortedIds[1]}-${tradeAdId}`
        : `${sortedIds[0]}-${sortedIds[1]}`;
      
      res.json({
        chat: {
          id: chatId,
          otherUser: {
            id: otherUser.id,
            username: otherUser.username,
            profile: otherUser.profile,
            region: otherUser.region
          },
          tradeAd: message.trade,
          unreadCount: 0
        },
        existing: true
      });
    } else {
      // Создаем новый чат (но не создаем сообщение)
      const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        include: { profile: true }
      });
      
      const tradeAd = await prisma.tradeAd.findUnique({
        where: { id: tradeAdId }
      });
      
      if (!otherUser || !tradeAd) {
        return res.status(404).json({ 
          success: false,
          error: 'User or trade ad not found' 
        });
      }
      
      const sortedIds = [userId, otherUserId].sort();
      const chatId = tradeAdId 
        ? `${sortedIds[0]}-${sortedIds[1]}-${tradeAdId}`
        : `${sortedIds[0]}-${sortedIds[1]}`;
      
      res.json({
        chat: {
          id: chatId,
          otherUser: {
            id: otherUser.id,
            username: otherUser.username,
            profile: otherUser.profile,
            region: otherUser.region
          },
          tradeAd: tradeAd,
          unreadCount: 0
        },
        existing: false
      });
    }
  } catch (error: any) {
    console.error('Ensure chat error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to ensure chat' 
    });
  }
});

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
        content,
        tradeId,
        isRead: false
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
        }
      }
    });
    
    res.json({
      success: true,
      message
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to send message' 
    });
  }
});

router.post('/:chatId/mark-read', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    // Разбираем chatId
    const parts = chatId.split('-');
    let userId1, userId2, tradeId;
    
    if (parts.length === 3) {
      [userId1, userId2, tradeId] = parts;
    } else if (parts.length === 2) {
      [userId1, userId2] = parts;
      tradeId = null;
    } else {
      userId1 = parts[0];
      userId2 = parts[1];
      tradeId = parts.slice(2).join('-');
    }

    // Проверяем, что текущий пользователь участвует в чате
    if (userId !== userId1 && userId !== userId2) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. You are not part of this chat.' 
      });
    }

    // Обновляем все сообщения, где текущий пользователь является получателем и они не прочитаны
    const whereClause: any = {
      receiverId: userId,
      isRead: false,
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    };

    if (tradeId && tradeId !== 'undefined') {
      whereClause.tradeId = tradeId;
    }

    // Обновляем сообщения как прочитанные
    await prisma.message.updateMany({
      where: whereClause,
      data: { isRead: true }
    });

    console.log(`✅ Marked messages as read for chat ${chatId} by user ${userId}`);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to mark messages as read' 
    });
  }
});

export default router;