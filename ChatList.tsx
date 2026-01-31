import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Badge,
  Skeleton,
} from '@mui/material';
import { Chat } from '../../../services/api';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  loading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  loading,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          alignSelf: 'stretch',
          padding: 2,
          background: 'white',
          borderRadius: 2,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 2,
          display: 'inline-flex',
        }}
      >
        <Skeleton variant="text" width={128} height={40} />
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} variant="rectangular" width={224} height={73} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        padding: 2,
        background: 'white',
        borderRadius: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 2,
        display: 'inline-flex',
      }}
    >
      <Typography
        sx={{
          width: 128,
          color: '#560D30',
          fontSize: 20,
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          wordWrap: 'break-word',
        }}
      >
        Messages
      </Typography>
      
      <Box sx={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1, display: 'flex' }}>
        {chats.map((chat) => (
          <Box
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            sx={{
              width: 224,
              height: 73,
              position: 'relative',
              boxShadow: '0px 0px 8px #F6C4D4',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(2px)',
                boxShadow: '0px 4px 12px rgba(246, 196, 212, 0.8)',
              },
            }}
          >
            <Box sx={{
              width: 224,
              height: 73,
              left: 0,
              top: 0,
              position: 'absolute',
              background: selectedChat?.id === chat.id ? 'linear-gradient(90deg, rgba(240, 94, 186, 0.1) 0%, rgba(153, 242, 247, 0.1) 100%)' : 'white',
              borderRadius: 2,
              border: selectedChat?.id === chat.id ? '1px #EC2EA6 solid' : '1px #DFE0EB solid',
            }} />
            
            {/* Аватар */}
            <Box sx={{
              height: 56,
              padding: 1,
              left: 6,
              top: 8.50,
              position: 'absolute',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              display: 'inline-flex',
            }}>
              <Avatar
                src={chat.otherUser.profile?.avatar || '/assets/default-avatar.png'}
                alt={chat.otherUser.username}
                sx={{ width: 40, height: 40 }}
              />
            </Box>
            
            {/* Индикатор непрочитанных */}
            {chat.unreadCount > 0 && (
              <Box sx={{
                width: 24,
                height: 25,
                paddingLeft: 0.5,
                paddingRight: 0.5,
                paddingTop: 0.3,
                paddingBottom: 0.3,
                left: 194,
                top: 27,
                position: 'absolute',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 1,
                display: 'inline-flex',
              }}>
                <Box sx={{
                  width: 24,
                  height: 25,
                  left: 0,
                  top: 0,
                  position: 'absolute',
                  background: chat.unreadCount > 1 ? '#96F2F7' : '#F6C4D4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography sx={{
                    color: '#560D30',
                    fontSize: 11,
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 'bold',
                  }}>
                    {chat.unreadCount}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {/* Имя пользователя */}
            <Typography
              sx={{
                left: 72,
                top: 17.50,
                position: 'absolute',
                color: selectedChat?.id === chat.id ? '#EC2EA6' : '#560D30',
                fontSize: 14,
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              {chat.otherUser.username}
            </Typography>
            
            {/* Trade Talk метка */}
            <Typography
              sx={{
                width: 92,
                left: 72,
                top: 41.50,
                position: 'absolute',
                color: '#852654',
                fontSize: 12,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              Trade talk
            </Typography>
          </Box>
        ))}
        
        {chats.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, width: 224 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: 14,
                fontFamily: '"Nobile", sans-serif',
                fontStyle: 'italic',
              }}
            >
              No messages yet. Start trading to chat with collectors! 🤝
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatList;