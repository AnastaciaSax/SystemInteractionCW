// client/src/pages/ChitChat/components/MessageBubble.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Message } from '../../../services/api';

interface MessageBubbleProps {
  message: Message;
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
  // Определяем, является ли сообщение trade offer по маркеру в content
  const isTradeOffer = message.content.startsWith('[TRADE_OFFER]');
  
  // Извлекаем imageUrl и tradeOfferId из content
  let imageUrl = '';
  let tradeOfferId = '';
  
  if (isTradeOffer) {
    // Формат: [TRADE_OFFER]imageUrl|tradeOfferId
    const contentWithoutMarker = message.content.replace('[TRADE_OFFER]', '');
    const parts = contentWithoutMarker.split('|');
    imageUrl = parts[0] || '';
    if (parts.length > 1) {
      tradeOfferId = parts[1];
    }
  }

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAcceptTrade && !isOwn && tradeOfferId) {
      onAcceptTrade(tradeOfferId);
    }
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRejectTrade && !isOwn && tradeOfferId) {
      onRejectTrade(tradeOfferId);
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
        width: '100%',
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
            src={imageUrl || 'https://placehold.co/230x230'}
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
            
            {/* Символ принятия - только для получателя */}
            {!isOwn && (
              <>
                <Typography
                  component="span"
                  onClick={handleAcceptClick}
                  sx={{
                    color: '#EC2EA6',
                    fontSize: 13,
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                    cursor: tradeOfferId ? 'pointer' : 'default',
                    opacity: tradeOfferId ? 1 : 0.5,
                    '&:hover': tradeOfferId ? {
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
                  onClick={handleRejectClick}
                  sx={{
                    color: '#EC2EA6',
                    fontSize: 13,
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                    cursor: tradeOfferId ? 'pointer' : 'default',
                    opacity: tradeOfferId ? 1 : 0.5,
                    '&:hover': tradeOfferId ? {
                      transform: 'scale(1.2)',
                      transition: 'transform 0.2s'
                    } : {},
                  }}
                >
                  {'❌'}
                </Typography>
              </>
            )}
          </Box>
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
            boxShadow: isOwn ? 'none' : '0px 4px 10px rgba(35.40, 73.71, 135.35, 0.25)',
            outline: isOwn ? 'none' : '1px #96F2F7 solid',
            outlineOffset: '-1px',
            width: '100%',
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