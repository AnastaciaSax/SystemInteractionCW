import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Skeleton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import ToggleButtons from './components/ToggleButtons';
import ChatSidebar from './components/ChatSidebar';
import ChatContent from './components/ChatContent';
import Notification from '../../components/ui/Notification';
import { chatAPI, Chat, Message as APIMessage } from '../../services/api';
import './ChitChat.css';

// Удаляем локальные интерфейсы и используем импортированные

const ChitChat: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'forum'>('chat');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<APIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
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

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getChats();
      setChats(response.data);
      
      // Выбираем первый чат, если есть
      if (response.data.length > 0 && !selectedChat) {
        setSelectedChat(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      showNotification('Failed to load chats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    setLoadingMessages(true);
    try {
      const response = await chatAPI.getMessages(chatId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showNotification('Failed to load messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!selectedChat) return;
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('receiverId', selectedChat.otherUser.id);
      
      if (selectedChat.tradeAd?.id) {
        formData.append('tradeId', selectedChat.tradeAd.id);
      }
      
      if (file) {
        formData.append('image', file);
      }
      
      const response = await chatAPI.sendMessage(formData);
      
      // Обновляем сообщения
      setMessages(prev => [...prev, response.data]);
      
      // Обновляем последнее сообщение в чате
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { 
              ...chat, 
              lastMessage: {
                id: response.data.id,
                content: response.data.content,
                createdAt: response.data.createdAt,
                senderId: response.data.senderId,
                receiverId: response.data.receiverId,
                isRead: response.data.isRead,
                tradeId: response.data.tradeId,
                sender: response.data.sender
              }
            }
          : chat
      ));
      
      showNotification('Message sent successfully', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Failed to send message', 'error');
    }
  };

  const handleSendTradeOffer = async (file: File, message: string) => {
    if (!selectedChat || !selectedChat.tradeAd) return;
    
    try {
      const formData = new FormData();
      formData.append('tradeAdId', selectedChat.tradeAd.id);
      formData.append('message', message);
      formData.append('image', file);
      
      await chatAPI.sendTradeOffer(formData);
      
      // Добавляем сообщение с trade offer
      const tradeOfferMessage: APIMessage = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: selectedChat.otherUser.id,
        content: `Trade offer: ${message}`,
        tradeId: selectedChat.tradeAd.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUser.id,
          username: currentUser.username,
          profile: currentUser.profile
        }
      };
      
      setMessages(prev => [...prev, tradeOfferMessage]);
      showNotification('Trade offer sent successfully', 'success');
    } catch (error) {
      console.error('Error sending trade offer:', error);
      showNotification('Failed to send trade offer', 'error');
    }
  };

  const handleAcceptTrade = async () => {
    if (!selectedChat || !selectedChat.tradeAd) return;
    
    try {
      await chatAPI.acceptTrade(selectedChat.tradeAd.id);
      showNotification('Trade accepted! Please leave feedback.', 'success');
    } catch (error) {
      console.error('Error accepting trade:', error);
      showNotification('Failed to accept trade', 'error');
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

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  // Оборачиваем setSelectedChat для ChatSidebar
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  // Skeleton для загрузки
  if (loading) {
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
        
        <PageBanner
          title="Chit-Chat"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Chit-Chat' }
          ]}
          imageUrl="/assets/banner-chit-chat.png"
        />
        
        <Container sx={{ maxWidth: '1280px !important', py: 4 }}>
          <ToggleButtons mode={mode} onModeChange={() => {}} />
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Sidebar Skeleton */}
            <Grid item xs={12} md={3}>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Grid>
            
            {/* Content Skeleton */}
            <Grid item xs={12} md={9}>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Grid>
          </Grid>
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
      
      {/* Уведомление */}
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
        }}
      >
        {/* Переключение между Chat и Forum */}
        <ToggleButtons mode={mode} onModeChange={setMode} />
        
        {mode === 'chat' ? (
          <Grid container spacing={isMobile ? 1 : 3} sx={{ mt: 2 }}>
            {/* Боковая панель с чатами */}
            <Grid item xs={12} md={3}>
              <ChatSidebar
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                loading={loading}
              />
            </Grid>
            
            {/* Основное окно чата */}
            <Grid item xs={12} md={9}>
              {selectedChat ? (
                <ChatContent
                  chat={selectedChat}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onSendTradeOffer={handleSendTradeOffer}
                  onAcceptTrade={handleAcceptTrade}
                  onSubmitComplaint={handleSubmitComplaint}
                  loadingMessages={loadingMessages}
                  currentUser={currentUser}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'white',
                    borderRadius: 3,
                    p: 4,
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
            </Grid>
          </Grid>
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