/// client/src/pages/ChitChat/components/ForumTopicWindow.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { LocalForumTopic, LocalForumMessage } from '../../../utils/forumStorage';
import { toggleMessageLike } from '../../../utils/forumStorage';

interface ForumTopicWindowProps {
  topic: LocalForumTopic;
  messages: LocalForumMessage[];
  onSendMessage: (content: string) => void;
  currentUser: any;
}

const ForumTopicWindow: React.FC<ForumTopicWindowProps> = ({
  topic,
  messages,
  onSendMessage,
  currentUser,
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleLikeMessage = (messageId: string) => {
    if (toggleMessageLike(topic.id, messageId, currentUser.id)) {
      // Обновить UI - это сделаем через force re-render
      window.dispatchEvent(new Event('storage'));
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Группируем сообщения по дате
  const groupedMessages: Record<string, LocalForumMessage[]> = {};
  messages.forEach(msg => {
    const date = formatDate(msg.createdAt);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(msg);
  });

  return (
    <Box
      sx={{
        flex: '1 1 0',
        alignSelf: 'stretch',
        paddingTop: 2,
        paddingBottom: 2,
        background: 'white',
        borderRadius: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1,
        display: 'inline-flex',
        overflow: 'hidden',
        height: '720px', // Фиксированная высота
        minHeight: '600px',
      }}
    >
      {/* Верхняя панель с информацией о теме */}
      <Box
        sx={{
          alignSelf: 'stretch',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          display: 'inline-flex',
          px: 2,
          py: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#560D30',
              fontSize: 18,
              fontFamily: '"McLaren", cursive',
              fontWeight: 600,
            }}
          >
            {topic.title}
          </Typography>
          <Typography
            sx={{
              color: '#852654',
              fontSize: 12,
              fontFamily: '"Nobile", sans-serif',
            }}
          >
            {topic.description}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: '#560D30', fontSize: 12, fontFamily: '"Nobile", sans-serif' }}>
              👥 {topic.participants} participants
            </Typography>
            <Typography sx={{ color: '#852654', fontSize: 11, fontFamily: '"Nobile", sans-serif' }}>
              💬 {topic.messageCount} messages
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Разделительная линия */}
      <Divider
        sx={{
          width: '100%',
          height: '2px',
          background: 'rgba(86, 13, 48, 0.50)',
        }}
      />
      
      {/* Окно сообщений с фиксированной высотой и скроллом */}
      <Box
        sx={{
          alignSelf: 'stretch',
          flex: 1, // Занимает все доступное пространство
          padding: 2,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 2,
          display: 'flex',
          overflowY: 'auto',
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
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: 16,
                fontFamily: '"Nobile", sans-serif',
                fontStyle: 'italic',
              }}
            >
              No messages yet. Be the first to start the conversation! 💬
            </Typography>
          </Box>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <Box key={date} sx={{ width: '100%' }}>
              {/* Дата */}
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Box
                  sx={{
                    padding: '2px 12px',
                    background: 'rgba(240, 94, 186, 0.1)',
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#560D30',
                      fontSize: 12,
                      fontFamily: '"Nobile", sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    {date}
                  </Typography>
                </Box>
              </Box>
              
              {/* Сообщения этой даты */}
              {dateMessages.map((msg) => {
                const isOwn = msg.senderId === currentUser.id;
                const isLiked = msg.likes?.includes(currentUser.id);
                
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: isOwn ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        padding: 1.5,
                        background: isOwn 
                          ? 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)' 
                          : '#F8F9FA',
                        borderRadius: 2,
                        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                      }}
                    >
                      {/* Информация об отправителе */}
                      {!isOwn && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar
                            src={msg.sender.avatar || '/assets/default-avatar.png'}
                            alt={msg.sender.username}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography
                            sx={{
                              color: '#560D30',
                              fontSize: 12,
                              fontFamily: '"McLaren", cursive',
                              fontWeight: 600,
                            }}
                          >
                            {msg.sender.username}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#852654',
                              fontSize: 10,
                              fontFamily: '"Nobile", sans-serif',
                            }}
                          >
                            {formatTime(msg.createdAt)}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Сообщение */}
                      <Typography
                        sx={{
                          color: isOwn ? '#560D30' : '#11073A',
                          fontSize: 13,
                          fontFamily: '"Nobile", sans-serif',
                          wordWrap: 'break-word',
                          mb: 1,
                        }}
                      >
                        {msg.content}
                      </Typography>
                      
                      {/* Лайки и время для своих сообщений */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {msg.likes && msg.likes.length > 0 && (
                            <>
                              <ThumbUpIcon sx={{ fontSize: 12, color: '#EC2EA6' }} />
                              <Typography sx={{ color: '#852654', fontSize: 10 }}>
                                {msg.likes.length}
                              </Typography>
                            </>
                          )}
                        </Box>
                        
                        {isOwn && (
                          <Typography sx={{ color: '#852654', fontSize: 10 }}>
                            {formatTime(msg.createdAt)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Кнопка лайка для чужих сообщений */}
                    {!isOwn && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5, ml: 1 }}>
                        <IconButton
                          onClick={() => handleLikeMessage(msg.id)}
                          size="small"
                          sx={{ padding: 0 }}
                        >
                          {isLiked ? (
                            <ThumbUpIcon sx={{ fontSize: 14, color: '#EC2EA6' }} />
                          ) : (
                            <ThumbUpOutlinedIcon sx={{ fontSize: 14, color: '#852654' }} />
                          )}
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Поле ввода сообщения */}
      <Box
        sx={{
          alignSelf: 'stretch',
          boxShadow: '0px 0px 8px #F6C4D4',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 1,
          display: 'inline-flex',
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            flex: '1 1 0',
            paddingLeft: 2,
            paddingRight: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            gap: 2,
          }}
        >
          {/* Поле ввода */}
          <TextField
            fullWidth
            multiline
            maxRows={3}
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
                height: 56,
              },
              flex: 1,
            }}
          />
          
          {/* Иконка отправки */}
          <Tooltip title="Send Message">
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
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ForumTopicWindow;