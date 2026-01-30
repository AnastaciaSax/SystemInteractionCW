import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Message } from '../../../services/api';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  formatTime: (dateString: string) => string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, formatTime }) => {
  const hasImage = message.content.includes('[IMAGE]') || message.imageUrl;
  const isTradeOffer = message.tradeId && hasImage;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      {!isOwn && message.sender && (
        <Avatar
          src={message.sender.profile?.avatar || '/assets/default-avatar.png'}
          alt={message.sender.username}
          sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
        />
      )}
      
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start',
        }}
      >
        {!isOwn && message.sender && (
          <Typography
            sx={{
              color: '#560D30',
              fontSize: '12px',
              fontFamily: '"McLaren", cursive',
              mb: 0.5,
            }}
          >
            {message.sender.username}
          </Typography>
        )}
        
        <Box
          sx={{
            background: isOwn
              ? 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)'
              : 'white',
            borderRadius: 2,
            p: 2,
            boxShadow: isOwn 
              ? '0px 2px 8px rgba(233, 196, 217, 0.3)'
              : '0px 4px 10px rgba(35, 40, 73, 0.25)',
            border: isOwn ? 'none' : '1px solid rgba(150, 242, 247, 0.5)',
            position: 'relative',
            minWidth: isTradeOffer ? '300px' : 'auto',
          }}
        >
          {isTradeOffer ? (
            <Box>
              <img
                src={message.imageUrl || '/assets/default-trade.png'}
                alt="Trade Offer"
                style={{
                  width: '100%',
                  maxWidth: '230px',
                  height: 'auto',
                  borderRadius: '10px',
                  marginBottom: '8px',
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    color: '#852654',
                    fontSize: '13px',
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  Trade Offer
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <CheckIcon sx={{ color: '#EC2EA6', fontSize: 16, cursor: 'pointer' }} />
                  <CloseIcon sx={{ color: '#EC2EA6', fontSize: 16, cursor: 'pointer' }} />
                </Box>
              </Box>
              {message.content && !message.content.includes('[IMAGE]') && (
                <Typography
                  sx={{
                    color: '#560D30',
                    fontSize: '13px',
                    fontFamily: '"Nobile", sans-serif',
                    mt: 1,
                  }}
                >
                  {message.content}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography
              sx={{
                color: isOwn ? '#560D30' : '#11073A',
                fontSize: '13px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.content}
            </Typography>
          )}
        </Box>
        
        <Typography
          sx={{
            color: '#852654',
            fontSize: '11px',
            fontFamily: '"Nobile", sans-serif',
            fontWeight: 400,
            mt: 0.5,
          }}
        >
          {formatTime(message.createdAt)}
          {message.isRead && isOwn && ' • Read'}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;