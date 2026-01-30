import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Badge,
  Skeleton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Chat, Message } from '../../../services/api';

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  loading: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  loading,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box
        sx={{
          background: 'white',
          borderRadius: 3,
          p: 2,
          height: 'calc(100vh - 300px)',
          overflow: 'auto',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#560D30',
            fontSize: '20px',
            fontFamily: '"McLaren", cursive',
            mb: 2,
          }}
        >
          Messages
        </Typography>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={73}
            sx={{ mb: 2, borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: 3,
        p: 2,
        height: 'calc(100vh - 300px)',
        overflow: 'auto',
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
      <Typography
        variant="h6"
        sx={{
          color: '#560D30',
          fontSize: '20px',
          fontFamily: '"McLaren", cursive',
          mb: 2,
        }}
      >
        Messages
      </Typography>
      
      <List sx={{ p: 0 }}>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            sx={{
              background: selectedChat?.id === chat.id 
                ? 'linear-gradient(90deg, rgba(240, 94, 186, 0.1) 0%, rgba(153, 242, 247, 0.1) 100%)' 
                : 'transparent',
              borderRadius: 2,
              mb: 1,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(90deg, rgba(240, 94, 186, 0.05) 0%, rgba(153, 242, 247, 0.05) 100%)',
                transform: 'translateX(4px)',
              },
              boxShadow: '0px 0px 8px rgba(246, 196, 212, 0.5)',
              position: 'relative',
            }}
          >
            <ListItemAvatar>
              <Badge
                color="error"
                badgeContent={chat.unreadCount}
                invisible={chat.unreadCount === 0}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: chat.unreadCount > 0 
                      ? (chat.unreadCount > 1 ? '#96F2F7' : '#F6C4D4')
                      : 'transparent',
                    color: '#560D30',
                    fontWeight: 'bold',
                  },
                }}
              >
                <Avatar
                  src={chat.otherUser.profile?.avatar || '/assets/default-avatar.png'}
                  alt={chat.otherUser.username}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid #EC2EA6',
                  }}
                />
              </Badge>
            </ListItemAvatar>
            
            <ListItemText
              primary={
                <Typography
                  sx={{
                    color: selectedChat?.id === chat.id ? '#EC2EA6' : '#560D30',
                    fontSize: '14px',
                    fontFamily: '"McLaren", cursive',
                    fontWeight: 400,
                  }}
                >
                  {chat.otherUser.username}
                </Typography>
              }
              secondary={
                <>
                  <Typography
                    sx={{
                      color: '#852654',
                      fontSize: '12px',
                      fontFamily: '"Nobile", sans-serif',
                      fontWeight: 400,
                      display: 'block',
                    }}
                  >
                    {chat.lastMessage?.content 
                      ? (chat.lastMessage.content.length > 30 
                        ? chat.lastMessage.content.substring(0, 30) + '...' 
                        : chat.lastMessage.content)
                      : 'Start a conversation'}
                  </Typography>
                  {chat.lastMessage?.createdAt && (
                    <Typography
                      sx={{
                        color: '#852654',
                        fontSize: '10px',
                        fontFamily: '"Nobile", sans-serif',
                        fontWeight: 400,
                        mt: 0.5,
                      }}
                    >
                      {formatTime(chat.lastMessage.createdAt)}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
        
        {chats.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '14px',
                fontFamily: '"Nobile", sans-serif',
                fontStyle: 'italic',
              }}
            >
              No messages yet. Start trading to chat with collectors! 🤝
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default ChatSidebar;