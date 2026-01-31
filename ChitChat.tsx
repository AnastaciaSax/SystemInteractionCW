// client/src/pages/ChitChat/ChitChat.tsx
import React, { useState, useEffect } from 'react';
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
import { chatAPI, Chat, Message as APIMessage } from '../../services/api';
import './ChitChat.css';

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

  const handleSendMessage = async (content: string) => {
    if (!selectedChat) return;
    
    try {
      const response = await chatAPI.sendMessage({
        receiverId: selectedChat.otherUser.id,
        content,
        tradeId: selectedChat.tradeAd?.id
      });
      
      setMessages(prev => [...prev, response.data]);
      
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { 
              ...chat, 
              lastMessage: response.data,
              unreadCount: 0,
            }
          : chat
      ));
      
      showNotification('Message sent successfully', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Failed to send message', 'error');
    }
  };

  const handleSendTradeOffer = async (file: File, textMessage: string) => {
    if (!selectedChat || !selectedChat.tradeAd) {
      showNotification('No trade ad selected for offer', 'error');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('tradeAdId', selectedChat.tradeAd.id);
      formData.append('textMessage', textMessage);
      formData.append('image', file);
      
      // Используем axios напрямую для отправки формы
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/trade-offer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setMessages(prev => [...prev, result.message]);
      showNotification('Trade offer sent successfully', 'success');
    } catch (error: any) {
      console.error('Error sending trade offer:', error);
      showNotification(error.message || 'Failed to send trade offer', 'error');
    }
  };

  const handleAcceptTrade = async (offerId: string) => {
    try {
      await chatAPI.acceptTradeOffer(offerId, true);
      showNotification('Trade accepted!', 'success');
      fetchChats();
    } catch (error) {
      console.error('Error accepting trade:', error);
      showNotification('Failed to accept trade', 'error');
    }
  };

  const handleRejectTrade = async (offerId: string) => {
    try {
      await chatAPI.acceptTradeOffer(offerId, false);
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
    try {
      await chatAPI.finishTrade(tradeId, { rating, comment });
      showNotification('Trade completed successfully!', 'success');
      fetchChats();
    } catch (error) {
      console.error('Error finishing trade:', error);
      showNotification('Failed to finish trade', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

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
        }}
      >
        {mode === 'chat' ? (
          <Box sx={{ 
            width: '100%', 
            height: '720px',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 2,
            display: 'inline-flex'
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
                  {chats.length === 0 
                    ? 'No messages yet. Start trading to chat with collectors! 🤝' 
                    : 'Select a chat to start messaging! 💬'
                  }
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