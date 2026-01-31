import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Message } from '../../../services/api';

interface MessageBubbleProps {
  message: Message & { imageUrl?: string }; // Добавляем imageUrl
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
  // Определяем, является ли сообщение trade offer по наличию imageUrl
  const isTradeOffer = message.imageUrl != null;

  return (
    <Box
      sx={{
        alignSelf: isOwn ? 'stretch' : 'stretch',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        gap: 0.5,
        display: 'flex',
        mb: 2,
      }}
    >
      {isTradeOffer ? (
        // Сообщение с trade offer
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
          <img
            style={{ width: 230, height: 230, borderRadius: 10 }}
            src={message.imageUrl || 'https://placehold.co/230x230'}
            alt="Trade Offer"
          />
          <Box sx={{ alignSelf: 'stretch', textAlign: 'center' }}>
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
            <Typography
              component="span"
              sx={{
                color: '#EC2EA6',
                fontSize: 13,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                wordWrap: 'break-word',
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
            <Typography
              component="span"
              sx={{
                color: '#EC2EA6',
                fontSize: 13,
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                wordWrap: 'break-word',
              }}
            >
              {'❌'}
            </Typography>
            
            {!isOwn && onAcceptTrade && onRejectTrade && (
              <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'center' }}>
                <IconButton
                  onClick={() => onAcceptTrade(message.id)}
                  sx={{
                    background: '#4CAF50',
                    color: 'white',
                    '&:hover': { background: '#45a049' },
                  }}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  onClick={() => onRejectTrade(message.id)}
                  sx={{
                    background: '#FF4C4C',
                    color: 'white',
                    '&:hover': { background: '#ff3333' },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          
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
              width: 380,
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