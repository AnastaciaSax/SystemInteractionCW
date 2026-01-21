// client/src/components/cards/OfferTradeModal.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Rating,
} from '@mui/material';
import Modal from '../ui/Modal';
import { TradeAdWithDetails } from '../../services/types';

interface OfferTradeModalProps {
  open: boolean;
  onClose: () => void;
  ad: TradeAdWithDetails;
}

const OfferTradeModal: React.FC<OfferTradeModalProps> = ({
  open,
  onClose,
  ad,
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('Sending offer for ad:', ad.id, 'Message:', message);
      // TODO: Реализовать API для отправки предложения
      // В будущем это будет вести в приватный чат
      setTimeout(() => {
        setLoading(false);
        onClose();
        setMessage('');
        // Показываем уведомление об успехе
        alert('Trade offer sent! You will be redirected to private chat once it\'s implemented.');
      }, 1000);
    } catch (error) {
      console.error('Error sending offer:', error);
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Make a Trade Offer"
      maxWidth="md"
      blurBackground
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Информация о сделке */}
        <Box sx={{ 
          backgroundColor: 'rgba(240, 94, 186, 0.1)', 
          borderRadius: '10px', 
          padding: 2 
        }}>
          <Typography
            sx={{
              color: '#560D30',
              fontFamily: '"McLaren", cursive',
              fontSize: '18px',
              mb: 1,
              textAlign: 'center',
            }}
          >
            You are making an offer to {ad.user?.username}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={ad.photo || '/assets/default-figurine.png'}
              alt={ad.title}
              sx={{
                width: 80,
                height: 80,
                borderRadius: '10px',
                objectFit: 'cover',
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: '#560D30',
                  fontFamily: '"McLaren", cursive',
                  fontSize: '16px',
                  mb: 0.5,
                }}
              >
                {ad.title}
              </Typography>
              <Typography
                sx={{
                  color: '#882253',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '14px',
                }}
              >
                Condition: {ad.condition} | Series: {ad.figurine?.series}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Rating
                  value={ad.user?.profile?.rating || 0}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ color: '#EC2EA6' }}
                />
                <Typography
                  sx={{
                    color: '#882253',
                    fontFamily: '"Nobile", sans-serif',
                    fontSize: '12px',
                  }}
                >
                  {ad.user?.profile?.rating?.toFixed(1) || '0.0'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Инструкция */}
        <Box>
          <Typography
            sx={{
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
              fontSize: '14px',
              mb: 2,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            Send a message to {ad.user?.username} to start negotiating the trade.
            Once accepted, you'll be connected in a private chat.
          </Typography>
        </Box>

        {/* Сообщение */}
        <Box>
          <Typography
            sx={{
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
              fontSize: '16px',
              mb: 1,
            }}
          >
            Your offer message:
          </Typography>
          <TextField
            multiline
            minRows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${ad.user?.username}! I'm interested in your ${ad.title}. I'd like to offer...`}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: 'white',
                border: '1px solid #F056B7',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Nobile", sans-serif',
                fontSize: '14px',
                color: '#560D30',
              },
            }}
          />
        </Box>

        {/* Подсказки */}
        <Box sx={{ 
          backgroundColor: 'rgba(255, 241, 248, 0.5)', 
          borderRadius: '10px', 
          padding: 2 
        }}>
          <Typography
            sx={{
              color: '#882253',
              fontFamily: '"Nobile", sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Tips for a good offer:
          </Typography>
          <Typography
            sx={{
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
              fontSize: '13px',
              mb: 0.5,
            }}
          >
            • Be specific about what you're offering in return
          </Typography>
          <Typography
            sx={{
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
              fontSize: '13px',
              mb: 0.5,
            }}
          >
            • Mention the condition of your items
          </Typography>
          <Typography
            sx={{
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
              fontSize: '13px',
            }}
          >
            • Propose a meeting location or shipping method
          </Typography>
        </Box>

        {/* Кнопки */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: '#560D30',
              borderColor: '#560D30',
              borderRadius: '10px',
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              textTransform: 'none',
              flex: 1,
              '&:hover': {
                borderColor: '#560D30',
                backgroundColor: 'rgba(86, 13, 48, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !message.trim()}
            sx={{
              backgroundColor: '#EC2EA6',
              color: 'white',
              borderRadius: '10px',
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              textTransform: 'none',
              flex: 2,
              '&:hover': {
                backgroundColor: '#F056B7',
              },
              '&:disabled': {
                backgroundColor: '#CCCCCC',
              },
            }}
          >
            {loading ? 'Sending Offer...' : 'Send Offer & Start Chat'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OfferTradeModal;