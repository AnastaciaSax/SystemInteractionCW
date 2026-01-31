import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  Alert,
  Avatar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Modal from '../../../components/ui/Modal';

interface FinishTradeModalProps {
  open: boolean;
  onClose: () => void;
  onFinishTrade: (rating: number, comment: string) => void;
  tradeAd?: any; // Сделать опциональным
  otherUser?: any; 
}

const FinishTradeModal: React.FC<FinishTradeModalProps> = ({
  open,
  onClose,
  onFinishTrade,
  tradeAd,
  otherUser,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (comment.trim()) {
      onFinishTrade(rating, comment);
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Finish Trade"
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {submitted ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Trade completed successfully! Thank you for your feedback.
          </Alert>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 32 }} />
              <Typography
                sx={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 600,
                }}
              >
                Complete Trade: {tradeAd?.title}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              Please leave feedback for {otherUser?.username} to help build our trusted community.
            </Alert>

            {/* Trade partner info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, background: 'rgba(255, 241, 248, 0.3)', borderRadius: 2 }}>
              <Avatar
                src={otherUser?.profile?.avatar || '/assets/default-avatar.png'}
                alt={otherUser?.username}
                sx={{ width: 60, height: 60 }}
              />
              <Box>
                <Typography
                  sx={{
                    color: '#560D30',
                    fontSize: '18px',
                    fontFamily: '"Nobile", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {otherUser?.username}
                </Typography>
                <Typography
                  sx={{
                    color: '#852654',
                    fontSize: '14px',
                    fontFamily: '"Nobile", sans-serif',
                  }}
                >
                  {otherUser?.profile?.location || 'No location set'}
                </Typography>
              </Box>
            </Box>

            {/* Rating */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                }}
              >
                How was your trade experience?
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 5)}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#EC2EA6',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#F05EBA',
                  },
                }}
              />
            </Box>

            {/* Comment */}
            <TextField
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this trade (optional but helpful)..."
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  borderColor: '#F6C4D4',
                  '&:hover fieldset': {
                    borderColor: '#EC2EA6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#EC2EA6',
                  },
                },
              }}
            />

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={handleClose}
                sx={{
                  color: '#560D30',
                  borderColor: '#560D30',
                  '&:hover': {
                    borderColor: '#82164A',
                    background: 'rgba(86, 13, 48, 0.05)',
                  },
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!comment.trim()}
                sx={{
                  background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #45a049 0%, #4CAF50 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(76, 175, 80, 0.3)',
                  },
                }}
                variant="contained"
                startIcon={<CheckCircleIcon />}
              >
                Complete Trade
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default FinishTradeModal;