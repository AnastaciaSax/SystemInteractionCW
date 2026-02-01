import React from 'react';
import { Box, Typography } from '@mui/material';

interface MessageBubbleProps {
  message: Message & { imageUrl?: string };
  isOwn: boolean;
  formatTime: (dateString: string) => string;
  onAcceptTrade?: (offerId: string) => void;
  onRejectTrade?: (offerId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  formatTime,
  onAcceptTrade,
  onRejectTrade
}) => {
  const isTradeOffer = message.imageUrl != null;

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAcceptTrade && !isOwn) {
      onAcceptTrade(message.id);
    }
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRejectTrade && !isOwn) {
      onRejectTrade(message.id);
    }
  };

  return (
    <Box
      sx={{
        alignSelf: isOwn ? 'flex-end' : 'flex-start',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        gap: 0.5,
        display: 'flex',
        mb: 2,
        maxWidth: '400px',
      }}
    >
      {isTradeOffer ? (
        // Trade offer сообщение
        <Box
          sx={{
            maxWidth: 400,
            padding: 2,
            background: isOwn ? 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)' : 'white',
            borderRadius: 2,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            display: 'flex',
            boxShadow: isOwn ? 'none' : '0px 4px 10px rgba(35.40, 73.71, 135.35, 0.25)',
            outline: isOwn ? 'none' : '1px #96F2F7 solid',
            outlineOffset: '-1px',
          }}
        >
          {/* Изображение trade offer */}
          <img
            style={{ 
              width: '100%', 
              maxWidth: '230px',
              height: 'auto',
              borderRadius: '10px' 
            }}
            src={message.imageUrl || 'https://placehold.co/230x230'}
            alt="Trade Offer"
          />
          
          {/* Текст с кликабельными символами */}
          <Box sx={{ 
            alignSelf: 'stretch', 
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5
          }}>
            <Typography
              component="span"
              sx={{
                color: '#852654',
                fontSize: 13,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              Trade Offer
            </Typography>
            
            {/* Символ принятия */}
            <Typography
              component="span"
              onClick={!isOwn ? handleAcceptClick : undefined}
              sx={{
                color: '#EC2EA6',
                fontSize: 13,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                cursor: !isOwn ? 'pointer' : 'default',
                '&:hover': !isOwn ? {
                  transform: 'scale(1.2)',
                  transition: 'transform 0.2s'
                } : {},
              }}
            >
              {' ✔️'}
            </Typography>
            
            <Typography
              component="span"
              sx={{
                color: '#852654',
                fontSize: 13,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              {' / '}
            </Typography>
            
            {/* Символ отклонения */}
            <Typography
              component="span"
              onClick={!isOwn ? handleRejectClick : undefined}
              sx={{
                color: '#EC2EA6',
                fontSize: 13,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                cursor: !isOwn ? 'pointer' : 'default',
                '&:hover': !isOwn ? {
                  transform: 'scale(1.2)',
                  transition: 'transform 0.2s'
                } : {},
              }}
            >
              {'❌'}
            </Typography>
          </Box>
          
          {/* Текстовое сообщение если есть */}
          {message.content && (
            <Typography
              sx={{
                alignSelf: 'stretch',
                color: '#560D30',
                fontSize: 13,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                wordWrap: 'break-word',
                mt: 1,
              }}
            >
              {message.content}
            </Typography>
          )}
        </Box>
      ) : (
        // Обычное сообщение
        <Box
          sx={{
            maxWidth: 400,
            padding: 2,
            background: isOwn ? 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)' : 'white',
            borderRadius: 2,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            display: 'flex',
          }}
        >
          <Typography
            sx={{
              width: '100%',
              color: isOwn ? '#560D30' : '#11073A',
              fontSize: 13,
              fontFamily: '"Nobile", sans-serif',
              fontWeight: 400,
              wordWrap: 'break-word',
            }}
          >
            {message.content}
          </Typography>
        </Box>
      )}
      
      <Typography
        sx={{
          alignSelf: isOwn ? 'stretch' : 'stretch',
          textAlign: isOwn ? 'right' : 'left',
          color: '#852654',
          fontSize: 11,
          fontFamily: '"Nobile", sans-serif',
          fontWeight: 400,
          wordWrap: 'break-word',
        }}
      >
        {formatTime(message.createdAt)}
        {message.isRead && isOwn && ' • Read'}
      </Typography>
    </Box>
  );
};

export default MessageBubble;