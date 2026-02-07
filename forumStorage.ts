/// client/src/utils/forumStorage.ts

export const FORUM_STORAGE_KEY = 'collector_forum_data';
export const FORUM_TOPICS_KEY = 'collector_forum_topics';
export const FORUM_MESSAGES_KEY = 'collector_forum_messages';

export interface LocalForumTopic {
  id: string;
  title: string;
  description: string;
  category: 'GENERAL' | 'TRADING' | 'COLLECTING' | 'REVIEWS' | 'NEWS' | 'EVENTS';
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  messageCount: number;
  lastActivity: string;
  participants: number;
  isPinned?: boolean;
  createdAt: string;
}

export interface LocalForumMessage {
  id: string;
  topicId: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  isRead?: boolean;
  likes?: string[];
}

// Инициализация начальных данных форума
export const initializeForumData = () => {
  const storedTopics = localStorage.getItem(FORUM_TOPICS_KEY);
  const storedMessages = localStorage.getItem(FORUM_MESSAGES_KEY);

  if (!storedTopics) {
    const initialTopics: LocalForumTopic[] = [
      {
        id: 'forum_general',
        title: 'General Discussion',
        description: 'Talk about anything collector-related!',
        category: 'GENERAL',
        creator: {
          id: 'system',
          username: 'CollectorBot',
          avatar: '/assets/collectorbot.png'
        },
        messageCount: 24,
        lastActivity: new Date().toISOString(),
        participants: 15,
        isPinned: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'forum_trading_tips',
        title: 'Trading Tips & Strategies',
        description: 'Share your best trading practices and negotiation tips',
        category: 'TRADING',
        creator: {
          id: 'system',
          username: 'TradeMaster',
          avatar: '/assets/trademaster.png'
        },
        messageCount: 18,
        lastActivity: new Date().toISOString(),
        participants: 12,
        isPinned: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'forum_collecting',
        title: 'Rare Finds & Collections',
        description: 'Show off your rare pieces and discuss collection strategies',
        category: 'COLLECTING',
        creator: {
          id: 'system',
          username: 'RareHunter',
          avatar: '/assets/rarehunter.png'
        },
        messageCount: 32,
        lastActivity: new Date().toISOString(),
        participants: 21,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'forum_reviews',
        title: 'User Reviews & Feedback',
        description: 'Share your trading experiences and rate other collectors',
        category: 'REVIEWS',
        creator: {
          id: 'system',
          username: 'ReviewMaster',
          avatar: '/assets/reviewmaster.png'
        },
        messageCount: 15,
        lastActivity: new Date().toISOString(),
        participants: 9,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'forum_events',
        title: 'Upcoming Events & Meetups',
        description: 'Discuss collector meetups, conventions, and trading events',
        category: 'EVENTS',
        creator: {
          id: 'system',
          username: 'EventPlanner',
          avatar: '/assets/eventplanner.png'
        },
        messageCount: 8,
        lastActivity: new Date().toISOString(),
        participants: 6,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem(FORUM_TOPICS_KEY, JSON.stringify(initialTopics));
  }

  if (!storedMessages) {
    const initialMessages: Record<string, LocalForumMessage[]> = {
      'forum_general': [
        {
          id: 'msg_general_1',
          topicId: 'forum_general',
          senderId: 'system',
          sender: {
            id: 'system',
            username: 'CollectorBot',
            avatar: '/assets/collectorbot.png'
          },
          content: 'Welcome to the General Discussion! Feel free to introduce yourself and share your collecting journey! 🎉',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['user_001', 'user_002']
        },
        {
          id: 'msg_general_2',
          topicId: 'forum_general',
          senderId: 'user_001',
          sender: {
            id: 'user_001',
            username: 'CollectorPro',
            avatar: '/assets/default-avatar.png'
          },
          content: 'Hello everyone! I\'ve been collecting for 5 years now. My favorite series is definitely G2 - the quality is amazing!',
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['system', 'user_002']
        }
      ],
      'forum_trading_tips': [
        {
          id: 'msg_trading_1',
          topicId: 'forum_trading_tips',
          senderId: 'system',
          sender: {
            id: 'system',
            username: 'TradeMaster',
            avatar: '/assets/trademaster.png'
          },
          content: 'Pro tip: Always take clear photos from multiple angles when trading! Good lighting makes a huge difference. 📸',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          likes: ['user_001', 'user_002']
        }
      ]
    };
    localStorage.setItem(FORUM_MESSAGES_KEY, JSON.stringify(initialMessages));
  }
};

// Получение всех тем
export const getForumTopics = (): LocalForumTopic[] => {
  const topics = localStorage.getItem(FORUM_TOPICS_KEY);
  return topics ? JSON.parse(topics) : [];
};

// Получение сообщений для темы
export const getForumMessages = (topicId: string): LocalForumMessage[] => {
  const allMessages = localStorage.getItem(FORUM_MESSAGES_KEY);
  const messagesMap = allMessages ? JSON.parse(allMessages) : {};
  return messagesMap[topicId] || [];
};

// Добавление новой темы
export const addForumTopic = (topic: Omit<LocalForumTopic, 'id' | 'createdAt'>): LocalForumTopic => {
  const topics = getForumTopics();
  const newTopic: LocalForumTopic = {
    ...topic,
    id: `forum_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  const updatedTopics = [...topics, newTopic];
  localStorage.setItem(FORUM_TOPICS_KEY, JSON.stringify(updatedTopics));
  
  // Инициализируем пустой массив сообщений для новой темы
  const allMessages = localStorage.getItem(FORUM_MESSAGES_KEY);
  const messagesMap = allMessages ? JSON.parse(allMessages) : {};
  messagesMap[newTopic.id] = [];
  localStorage.setItem(FORUM_MESSAGES_KEY, JSON.stringify(messagesMap));
  
  return newTopic;
};

// Добавление сообщения в тему
export const addForumMessage = (topicId: string, message: Omit<LocalForumMessage, 'id' | 'createdAt'>): LocalForumMessage => {
  const allMessages = localStorage.getItem(FORUM_MESSAGES_KEY);
  const messagesMap = allMessages ? JSON.parse(allMessages) : {};
  
  const newMessage: LocalForumMessage = {
    ...message,
    id: `msg_${topicId}_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  if (!messagesMap[topicId]) {
    messagesMap[topicId] = [];
  }
  
  messagesMap[topicId].push(newMessage);
  localStorage.setItem(FORUM_MESSAGES_KEY, JSON.stringify(messagesMap));
  
  // Обновляем статистику темы
  updateTopicStats(topicId);
  
  return newMessage;
};

// Обновление статистики темы
const updateTopicStats = (topicId: string) => {
  const topics = getForumTopics();
  const messages = getForumMessages(topicId);
  
  const updatedTopics = topics.map(topic => {
    if (topic.id === topicId) {
      // Собираем уникальных участников
      const uniqueParticipants = new Set(messages.map(msg => msg.senderId));
      
      return {
        ...topic,
        messageCount: messages.length,
        participants: uniqueParticipants.size,
        lastActivity: new Date().toISOString()
      };
    }
    return topic;
  });
  
  localStorage.setItem(FORUM_TOPICS_KEY, JSON.stringify(updatedTopics));
};

// Поиск тем
export const searchForumTopics = (query: string): LocalForumTopic[] => {
  const topics = getForumTopics();
  if (!query.trim()) return topics;
  
  const lowerQuery = query.toLowerCase();
  return topics.filter(topic => 
    topic.title.toLowerCase().includes(lowerQuery) ||
    topic.description.toLowerCase().includes(lowerQuery)
  );
};

// Получение категорий
export const getForumCategories = () => {
  return [
    { value: 'GENERAL', label: 'General', color: '#EC2EA6' },
    { value: 'TRADING', label: 'Trading', color: '#4CAF50' },
    { value: 'COLLECTING', label: 'Collecting', color: '#2196F3' },
    { value: 'REVIEWS', label: 'Reviews', color: '#FF9800' },
    { value: 'NEWS', label: 'News', color: '#9C27B0' },
    { value: 'EVENTS', label: 'Events', color: '#00BCD4' }
  ];
};

// Лайк сообщения
export const toggleMessageLike = (topicId: string, messageId: string, userId: string): boolean => {
  const allMessages = localStorage.getItem(FORUM_MESSAGES_KEY);
  if (!allMessages) return false;
  
  const messagesMap = JSON.parse(allMessages);
  const topicMessages = messagesMap[topicId];
  
  if (!topicMessages) return false;
  
  const updatedMessages = topicMessages.map((msg: LocalForumMessage) => {
    if (msg.id === messageId) {
      const likes = msg.likes || [];
      const isLiked = likes.includes(userId);
      
      return {
        ...msg,
        likes: isLiked 
          ? likes.filter(id => id !== userId)
          : [...likes, userId]
      };
    }
    return msg;
  });
  
  messagesMap[topicId] = updatedMessages;
  localStorage.setItem(FORUM_MESSAGES_KEY, JSON.stringify(messagesMap));
  
  return true;
};