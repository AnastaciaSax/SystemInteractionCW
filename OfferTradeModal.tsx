// client/src/components/cards/OfferTradeModal.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
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
    // Здесь будет логика отправки предложения обмена
    setLoading(true);
    try {
      console.log('Sending offer for ad:', ad.id, 'Message:', message);
      // TODO: Вызов API для отправки предложения
      setTimeout(() => {
        setLoading(false);
        onClose();
        setMessage('');
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
      title="Make an Offer"
      maxWidth="sm"
      blurBackground
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Информация о объявлении */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
          <Box>
            <Typography
              sx={{
                color: '#560D30',
                fontFamily: '"McLaren", cursive',
                fontSize: '18px',
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
          </Box>
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
            Your message to {ad.user?.username}:
          </Typography>
          <TextField
            multiline
            minRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your offer message here..."
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

        {/* Кнопки */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
              '&:hover': {
                backgroundColor: '#F056B7',
              },
              '&:disabled': {
                backgroundColor: '#CCCCCC',
              },
            }}
          >
            {loading ? 'Sending...' : 'Send Offer'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OfferTradeModal;