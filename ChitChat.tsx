import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import VerticalToggleButtons from './components/VerticalToggleButtons';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Notification from '../../components/ui/Notification';
import { chatAPI, Chat, Message as APIMessage, TradeOfferResponse } from '../../services/api';
import './ChitChat.css';

const ChitChat: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'forum'>('chat');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<APIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    type: 'info',
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const pendingTradeOfferProcessed = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Обработка pending trade offer при загрузке чатов
  const processPendingTradeOffer = useCallback((chatsList: Chat[]) => {
    if (pendingTradeOfferProcessed.current) return;
    
    const pendingTradeOfferStr = localStorage.getItem('pendingTradeOffer');
    if (pendingTradeOfferStr && chatsList.length > 0) {
      try {
        const tradeAd = JSON.parse(pendingTradeOfferStr);
        
        // Формируем id чата так же, как на сервере
        const sortedIds = [currentUser.id, tradeAd.userId].sort();
        const chatId = tradeAd.id 
          ? `${sortedIds[0]}-${sortedIds[1]}-${tradeAd.id}`
          : `${sortedIds[0]}-${sortedIds[1]}`;
        
        // Ищем чат с этим id
        const existingChat = chatsList.find(chat => chat.id === chatId);
        
        if (existingChat) {
          setSelectedChat(existingChat);
        } else {
          // Создаем новый чат в состоянии
          const newChat: Chat = {
            id: chatId,
            otherUser: {
              id: tradeAd.userId,
              username: tradeAd.user?.username || 'Trade Partner',
              profile: tradeAd.user?.profile || { avatar: '/assets/default-avatar.png' },
              region: tradeAd.user?.region
            },
            tradeAd: {
              id: tradeAd.id,
              title: tradeAd.title,
              status: 'ACTIVE',
              photo: tradeAd.photo,
              userId: tradeAd.userId
            },
            unreadCount: 0,
          };
          
          setChats(prev => [newChat, ...prev]);
          setSelectedChat(newChat);
        }
        
        // Очищаем pending trade offer и помечаем как обработанный
        localStorage.removeItem('pendingTradeOffer');
        pendingTradeOfferProcessed.current = true;
      } catch (error) {
        console.error('Error processing pending trade offer:', error);
      }
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchChats();
  }, []);

// Обработка выбора чата
useEffect(() => {
  if (selectedChat && isMounted.current) {
    setMessages([]);
    setCurrentPage(1);
    setHasMoreMessages(true);
    fetchMessages(selectedChat.id, 1);
    
    // ПОМЕЧАЕМ СООБЩЕНИЯ КАК ПРОЧИТАННЫЕ ПРИ ВЫБОРЕ ЧАТА
    // Это делается внутри fetchMessages для первой страницы
    // Но для надежности можно добавить и здесь
    const markAsRead = async () => {
      try {
        await chatAPI.markMessagesAsRead(selectedChat.id);
      } catch (error) {
        console.error('Error marking messages as read on chat select:', error);
      }
    };
    
    markAsRead();
  }
}, [selectedChat?.id]); // Зависимость только от ID чата

const fetchChats = async () => {
  if (!isMounted.current) return;
  
  setLoading(true);
  try {
    const response = await chatAPI.getChats();
    const chatsData = response.data;
    
    if (isMounted.current) {
      setChats(chatsData);
      
      // Обрабатываем pending trade offer после загрузки чатов
      processPendingTradeOffer(chatsData);
      
      // Выбираем первый чат, если нет выбранного
      if (!selectedChat && chatsData.length > 0) {
        setSelectedChat(chatsData[0]);
      }
    }
  } catch (error) {
    console.error('Error fetching chats:', error);
    showNotification('Failed to load chats', 'error');
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
};

const fetchMessages = async (chatId: string, page = 1) => {
  if (!isMounted.current || !chatId) return;
  
  setLoadingMessages(true);
  try {
    const response = await chatAPI.getMessages(chatId, page, 20);
    const newMessages = response.data;
    
    // ПРОВЕРЯЕМ СТАТУС СДЕЛКИ В СООБЩЕНИЯХ
    const hasCompletedStatus = newMessages.some(msg => 
      msg.content && msg.content.includes('|COMPLETED')
    );
    
    if (hasCompletedStatus && selectedChat?.tradeAd?.status !== 'COMPLETED') {
      updateChatStatus(chatId, 'COMPLETED');
    }
    
    // ПОМЕЧАЕМ СООБЩЕНИЯ КАК ПРОЧИТАННЫЕ ПРИ ЗАГРУЗКЕ
    if (page === 1) {
      try {
        await chatAPI.markMessagesAsRead(chatId);
        console.log('✅ Messages marked as read for chat:', chatId);
        
        // Обновляем состояние чатов, сбрасывая счетчик непрочитанных
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ));
        
        // Если этот чат выбран, обновляем и его
        if (selectedChat?.id === chatId) {
          setSelectedChat(prev => prev ? { ...prev, unreadCount: 0 } : null);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
    
    if (isMounted.current) {
      if (page === 1) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...newMessages, ...prev]);
      }
      
      // Проверяем, есть ли еще сообщения
      if (newMessages.length < 20) {
        setHasMoreMessages(false);
      }
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    showNotification('Failed to load messages', 'error');
  } finally {
    if (isMounted.current) {
      setLoadingMessages(false);
    }
  }
};

  // Функция для загрузки дополнительных сообщений
  const loadMoreMessages = async () => {
    if (!selectedChat || loadingMessages || !hasMoreMessages) return;
    
    const nextPage = currentPage + 1;
    try {
      const response = await chatAPI.getMessages(selectedChat.id, nextPage, 20);
      if (response.data.length > 0 && isMounted.current) {
        setMessages(prev => [...response.data, ...prev]);
        setCurrentPage(nextPage);
      }
      if (response.data.length < 20) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      showNotification('Failed to load more messages', 'error');
    }
  };

// Обновление статуса чата при принятии трейд-оффера
const updateChatStatus = useCallback((chatId: string, status: string) => {
  console.log('Updating chat status:', { chatId, status });
  
  // Используем только валидные статусы из AdStatus
  const validStatuses = ['ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    console.warn('Invalid status for tradeAd:', status);
    return;
  }
  
  setChats(prev => prev.map(chat => 
    chat.id === chatId && chat.tradeAd
      ? { 
          ...chat, 
          tradeAd: { 
            ...chat.tradeAd, 
            status 
          } 
        } 
      : chat
  ));
  
  // ОБНОВЛЯЕМ selectedChat ДАЖЕ ЕСЛИ ОН УЖЕ ВЫБРАН
  if (selectedChat?.id === chatId) {
    setSelectedChat(prev => prev ? {
      ...prev,
      tradeAd: prev.tradeAd ? {
        ...prev.tradeAd,
        status
      } : undefined
    } : null);
  }
}, [selectedChat]);

const handleSendMessage = async (content: string) => {
  if (!selectedChat) return;
  
  try {
    const response = await chatAPI.sendMessage({
      receiverId: selectedChat.otherUser.id,
      content,
      tradeId: selectedChat.tradeAd?.id
    });
    
    const newMessage = response.data.message;
    
    // Добавляем новое сообщение только в конец
    setMessages(prev => [...prev, newMessage]);
    
    // Обновляем чат
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { 
            ...chat, 
            lastMessage: newMessage,
            unreadCount: 0, // Сбрасываем счетчик при отправке сообщения
          }
        : chat
    ));
    
    // Помечаем все сообщения в чате как прочитанные
    if (selectedChat.id) {
      try {
        await chatAPI.markMessagesAsRead(selectedChat.id);
      } catch (error) {
        console.error('Error marking messages as read after sending:', error);
      }
    }
    
    showNotification('Message sent successfully', 'success');
  } catch (error) {
    console.error('Error sending message:', error);
    showNotification('Failed to send message', 'error');
  }
};

  const handleSendTradeOffer = async (file: File) => {
    if (!selectedChat || !selectedChat.tradeAd) {
      showNotification('No trade ad selected for offer', 'error');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('tradeAdId', selectedChat.tradeAd.id);
      formData.append('image', file);
      
      const response = await chatAPI.sendTradeOfferWithFile(formData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to send trade offer');
      }
      
      // Добавляем сообщение с трейд-оффером
      if (response.data.message && isMounted.current) {
        setMessages(prev => [...prev, response.data.message!]);
      }
      
      // Обновляем статус чата на PENDING
      updateChatStatus(selectedChat.id, 'PENDING');
      
      showNotification('Trade offer sent successfully', 'success');
    } catch (error: any) {
      console.error('Error sending trade offer:', error);
      showNotification(error.message || 'Failed to send trade offer', 'error');
    }
  };

const handleAcceptTrade = async (offerId: string) => {
  try {
    const response = await chatAPI.acceptTradeOffer(offerId, true);
    
    // Обновляем сообщения
    if (response.data.message && isMounted.current) {
      setMessages(prev => [...prev, response.data.message!]);
    }
    
    // Обновляем статус чата на PENDING (это правильный статус для TradeAd после принятия оффера)
    updateChatStatus(selectedChat?.id || '', 'PENDING');
    
    showNotification('Trade accepted!', 'success');
  } catch (error) {
    console.error('Error accepting trade:', error);
    showNotification('Failed to accept trade', 'error');
  }
};

  const handleRejectTrade = async (offerId: string) => {
    try {
      await chatAPI.acceptTradeOffer(offerId, false);
      
      // Обновляем статус чата
      updateChatStatus(selectedChat?.id || '', 'ACTIVE');
      
      showNotification('Trade offer rejected', 'info');
    } catch (error) {
      console.error('Error rejecting trade:', error);
      showNotification('Failed to reject trade', 'error');
    }
  };

  const handleSubmitComplaint = async (reason: string, details: string) => {
    if (!selectedChat) return;
    
    try {
      await chatAPI.submitComplaint({
        reportedUserId: selectedChat.otherUser.id,
        reason,
        details,
        chatId: selectedChat.id
      });
      
      showNotification('Complaint submitted successfully', 'success');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      showNotification('Failed to submit complaint', 'error');
    }
  };

const handleFinishTrade = async (tradeId: string, rating: number, comment: string) => {
  if (!selectedChat?.tradeAd) {
    showNotification('No trade selected', 'error');
    return;
  }

  try {
    const response = await chatAPI.finishTrade(tradeId, { rating, comment });
    
    if (response.data.success) {
      showNotification('Rating submitted successfully!', 'success');
      
      // СРАЗУ обновляем статус на основе ответа сервера
      if (response.data.tradeAd?.status) {
        updateChatStatus(selectedChat.id, response.data.tradeAd.status);
      }
      
      // Также обновляем список чатов для синхронизации
      await fetchChats();
      
      // Принудительно обновляем selectedChat с новыми данными
      if (selectedChat.id) {
        const updatedChats = await chatAPI.getChats();
        const updatedChat = updatedChats.data.find(chat => chat.id === selectedChat.id);
        if (updatedChat) {
          setSelectedChat(updatedChat);
        }
      }
    }
  } catch (error: any) {
    console.error('Error finishing trade:', error.response?.data || error);
    showNotification(error.response?.data?.error || 'Failed to submit rating', 'error');
  }
};

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    if (isMounted.current) {
      setNotification({
        open: true,
        message,
        type,
      });
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  // Остальной код (рендеринг) остается без изменений...
  // [Ваш существующий JSX код]

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D4 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        
        <PageBanner
          title="Chit-Chat"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Chit-Chat' }
          ]}
          imageUrl="/assets/banner-chit-chat.png"
        />
        
        <Container sx={{ maxWidth: '1280px !important', py: 4 }}>
          <Box sx={{ 
            width: '100%', 
            height: '720px',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 2,
            display: 'inline-flex'
          }}>
            <Box sx={{ 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'flex-start', 
              gap: 2, 
              display: 'inline-flex' 
            }}>
              <Skeleton variant="rectangular" width={197} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={197} height={40} sx={{ borderRadius: 1 }} />
            </Box>
            
            <Box sx={{ 
              alignSelf: 'stretch', 
              padding: 2, 
              background: 'white', 
              borderRadius: 2, 
              flexDirection: 'column', 
              justifyContent: 'flex-start', 
              alignItems: 'flex-start', 
              gap: 2, 
              display: 'inline-flex' 
            }}>
              <Skeleton variant="text" width={128} height={40} />
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} variant="rectangular" width={224} height={73} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
            
            <Box sx={{ 
              flex: '1 1 0', 
              alignSelf: 'stretch', 
              padding: 2, 
              background: 'white', 
              borderRadius: 2, 
              flexDirection: 'column', 
              justifyContent: 'flex-start', 
              alignItems: 'flex-start', 
              gap: 2, 
              display: 'inline-flex' 
            }}>
              <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Container>
        
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      />
      
      <PageBanner
        title="Chit-Chat"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Chit-Chat' }
        ]}
        imageUrl="/assets/banner-chit-chat.png"
      />
      
      <Container
        sx={{
          maxWidth: '1280px !important',
          py: { xs: 2, md: 4 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '600px',
        }}
      >
        {mode === 'chat' ? (
          <Box sx={{ 
            width: '100%', 
            height: '720px',
            minHeight: '600px',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 2,
            display: 'flex',
            flex: 1,
          }}>
            <VerticalToggleButtons mode={mode} onModeChange={setMode} />
            
            <ChatList
              chats={chats}
              selectedChat={selectedChat}
              onSelectChat={handleSelectChat}
              loading={loading}
            />
            
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                onSendTradeOffer={handleSendTradeOffer}
                onAcceptTrade={handleAcceptTrade}
                onRejectTrade={handleRejectTrade}
                onSubmitComplaint={handleSubmitComplaint}
                onFinishTrade={handleFinishTrade}
                loadingMessages={loadingMessages}
                currentUser={currentUser}
                hasMoreMessages={hasMoreMessages}
                onLoadMoreMessages={loadMoreMessages}
              />
            ) : (
              <Box
                sx={{
                  flex: '1 1 0',
                  alignSelf: 'stretch',
                  padding: 3,
                  background: 'white',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: '#852654',
                    fontSize: '18px',
                    fontFamily: '"Nobile", sans-serif',
                    fontStyle: 'italic',
                  }}
                >
                  Select a chat to start messaging! 💬
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              background: 'white',
              borderRadius: 3,
              p: 4,
              mt: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#560D30',
                fontFamily: '"McLaren", cursive',
                mb: 2,
              }}
            >
              Forum Coming Soon! 🚧
            </Typography>
            <Typography
              sx={{
                color: '#852654',
                fontFamily: '"Nobile", sans-serif',
              }}
            >
              Our community forum is under construction. Check back soon for discussions, tips, and more!
            </Typography>
          </Box>
        )}
      </Container>
      
      <Footer />
    </Box>
  );
};

export default ChitChat;