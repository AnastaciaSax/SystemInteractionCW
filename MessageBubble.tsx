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
  processingOfferId?: string | null;
  chatStatus?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  formatTime,
  onAcceptTrade,
  onRejectTrade,
  processingOfferId,
  chatStatus
}) => {
  // Определяем, является ли сообщение trade offer по маркеру в content
  const isTradeOffer = message.content.startsWith('[TRADE_OFFER]');
  
  // Извлекаем imageUrl и tradeOfferId из content
  let imageUrl = '';
  let tradeOfferId = '';
  let offerStatus = '';
  
  if (isTradeOffer) {
    // Формат: [TRADE_OFFER]imageUrl|tradeOfferId|status
    const contentWithoutMarker = message.content.replace('[TRADE_OFFER]', '');
    const parts = contentWithoutMarker.split('|');
    imageUrl = parts[0] || '';
    if (parts.length > 1) {
      tradeOfferId = parts[1];
    }
    if (parts.length > 2) {
      offerStatus = parts[2];
    }
  }

  // Если в сообщении нет статуса, смотрим на статус чата
// НО: chatStatus будет 'PENDING', а не 'ACCEPTED' для TradeAd
// Так что оставляем только проверку offerStatus из сообщения
const isOfferAccepted = offerStatus === 'ACCEPTED';
const isOfferRejected = offerStatus === 'REJECTED';

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAcceptTrade && !isOwn && tradeOfferId && !processingOfferId && !isOfferAccepted && !isOfferRejected) {
      onAcceptTrade(tradeOfferId);
    }
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRejectTrade && !isOwn && tradeOfferId && !processingOfferId && !isOfferAccepted && !isOfferRejected) {
      onRejectTrade(tradeOfferId);
    }
  };

  // Проверяем, обрабатывается ли это предложение сейчас
  const isProcessing = tradeOfferId === processingOfferId;

  // Показывать ли кнопки ✔️/❌?
  // Только если: это trade offer, НЕ наше сообщение, предложение не принято и не отклонено
  const showTradeButtons = isTradeOffer && 
                          !isOwn && 
                          !isOfferAccepted && 
                          !isOfferRejected &&
                          chatStatus !== 'ACCEPTED';

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
          
          {/* Сообщение о статусе предложения */}
          {isOfferAccepted && (
            <Typography
              sx={{
                color: '#4CAF50',
                fontSize: 14,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 'bold',
                textAlign: 'center',
                mt: 1,
              }}
            >
              ✓ Trade offer accepted!
            </Typography>
          )}
          
          {isOfferRejected && (
            <Typography
              sx={{
                color: '#FF6B6B',
                fontSize: 14,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 'bold',
                textAlign: 'center',
                mt: 1,
              }}
            >
              ✗ Trade offer rejected
            </Typography>
          )}
          
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
            
            {/* Кнопки принятия/отклонения */}
            {showTradeButtons && (
              <>
                <Typography
                  component="span"
                  onClick={isProcessing ? undefined : handleAcceptClick}
                  sx={{
                    color: isProcessing ? '#CCC' : '#EC2EA6',
                    fontSize: 13,
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                    cursor: isProcessing ? 'default' : 'pointer',
                    opacity: isProcessing ? 0.5 : 1,
                    '&:hover': isProcessing ? {} : {
                      transform: 'scale(1.2)',
                      transition: 'transform 0.2s'
                    },
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
                  onClick={isProcessing ? undefined : handleRejectClick}
                  sx={{
                    color: isProcessing ? '#CCC' : '#EC2EA6',
                    fontSize: 13,
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 400,
                    cursor: isProcessing ? 'default' : 'pointer',
                    opacity: isProcessing ? 0.5 : 1,
                    '&:hover': isProcessing ? {} : {
                      transform: 'scale(1.2)',
                      transition: 'transform 0.2s'
                    },
                  }}
                >
                  {'❌'}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      ) : (
        // Обычное сообщение или системное уведомление
        <Box
          sx={{
            maxWidth: 400,
            padding: 2,
            background: message.senderId === 'system' 
              ? 'linear-gradient(90deg, #E3F2FD 0%, #BBDEFB 100%)'
              : isOwn 
                ? 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)' 
                : 'white',
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
              color: message.senderId === 'system' ? '#1976D2' : (isOwn ? '#560D30' : '#11073A'),
              fontSize: 13,
              fontFamily: '"Nobile", sans-serif',
              fontWeight: message.senderId === 'system' ? 600 : 400,
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