import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Skeleton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import PersonIcon from '@mui/icons-material/Person';
import MessageBubble from './MessageBubble';
import TradeOfferModal from './TradeOfferModal';
import ComplaintModal from './ComplaintModal';
import FinishTradeModal from './FinishTradeModal';
import { Chat, Message } from '../../../services/api';

interface ChatContentProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string, file?: File) => void;
  onSendTradeOffer: (file: File, message: string) => void;
  onAcceptTrade: () => void;
  onSubmitComplaint: (reason: string, details: string) => void;
  loadingMessages: boolean;
  currentUser: any;
}

const ChatContent: React.FC<ChatContentProps> = ({
  chat,
  messages,
  onSendMessage,
  onSendTradeOffer,
  onAcceptTrade,
  onSubmitComplaint,
  loadingMessages,
  currentUser,
}) => {
  const [message, setMessage] = useState('');
  const [showTradeOfferModal, setShowTradeOfferModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showFinishTradeModal, setShowFinishTradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachTradeOffer = () => {
    setShowTradeOfferModal(true);
  };

  const handleViewProfile = () => {
    window.open(`/profile/${chat.otherUser.id}`, '_blank');
  };

  const handleReport = () => {
    setShowComplaintModal(true);
  };

  const handleFinishTrade = () => {
    setShowFinishTradeModal(true);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toUpperCase();
  };

  // Check if trade is ready to be finished (both accepted offer)
  const isTradeReadyToFinish = chat.tradeAd?.status === 'ACCEPTED';

  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: 3,
        height: 'calc(100vh - 300px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header with trade info */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(236, 46, 166, 0.2)',
          background: 'linear-gradient(90deg, rgba(255, 241, 248, 0.5) 0%, rgba(233, 196, 217, 0.5) 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={chat.otherUser.profile?.avatar || '/assets/default-avatar.png'}
              alt={chat.otherUser.username}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography
                sx={{
                  color: '#560D30',
                  fontSize: '15px',
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 400,
                }}
              >
                {chat.tradeAd?.title || `Chat with ${chat.otherUser.username}`}
              </Typography>
              <Typography
                sx={{
                  color: '#852654',
                  fontSize: '11px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 400,
                }}
              >
                Status: {chat.tradeAd?.status || 'Active'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Profile">
            <IconButton onClick={handleViewProfile} sx={{ color: '#560D30' }}>
              <PersonIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Report User">
            <IconButton onClick={handleReport} sx={{ color: '#560D30' }}>
              <ReportIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Messages container */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 240, 252, 0.9) 100%)',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(240, 94, 186, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#F05EBA',
            borderRadius: '3px',
          },
        }}
      >
        {loadingMessages ? (
          // Skeleton для сообщений
          <>
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={i % 2 === 0 ? '60%' : '70%'}
                  height={80}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            ))}
          </>
        ) : (
          // Сообщения
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUser.id}
                formatTime={formatTime}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input area */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(236, 46, 166, 0.2)',
          background: 'white',
          boxShadow: '0px 0px 8px rgba(246, 196, 212, 0.5)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                borderColor: '#F6C4D4',
                '&:hover fieldset': {
                  borderColor: '#EC2EA6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#EC2EA6',
                  borderWidth: 2,
                },
              },
            }}
          />
          
          <Tooltip title="Send Trade Offer (Attach Image)">
            <IconButton
              onClick={handleAttachTradeOffer}
              sx={{
                color: '#560D30',
                background: 'rgba(240, 94, 186, 0.1)',
                '&:hover': {
                  background: 'rgba(240, 94, 186, 0.2)',
                },
              }}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          
          {isTradeReadyToFinish && (
            <Tooltip title="Finish Trade">
              <IconButton
                onClick={handleFinishTrade}
                sx={{
                  color: '#4CAF50',
                  background: 'rgba(76, 175, 80, 0.1)',
                  '&:hover': {
                    background: 'rgba(76, 175, 80, 0.2)',
                  },
                }}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{
              color: message.trim() ? 'white' : '#560D30',
              background: message.trim() 
                ? 'linear-gradient(90deg, #EC2EA6 0%, #F05EBA 100%)'
                : 'rgba(240, 94, 186, 0.1)',
              '&:hover': {
                background: message.trim()
                  ? 'linear-gradient(90deg, #F05EBA 0%, #EC2EA6 100%)'
                  : 'rgba(240, 94, 186, 0.2)',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Modals */}
      <TradeOfferModal
        open={showTradeOfferModal}
        onClose={() => setShowTradeOfferModal(false)}
        onSendOffer={onSendTradeOffer}
        tradeAd={chat.tradeAd}
      />
      
      <ComplaintModal
        open={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        onSubmit={onSubmitComplaint}
        reportedUser={chat.otherUser}
      />
      
      <FinishTradeModal
        open={showFinishTradeModal}
        onClose={() => setShowFinishTradeModal(false)}
        onFinishTrade={onAcceptTrade}
        tradeAd={chat.tradeAd}
        otherUser={chat.otherUser}
      />
    </Box>
  );
};

export default ChatContent;