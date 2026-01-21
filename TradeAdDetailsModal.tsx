// client/src/components/cards/TradeAdDetailsModal.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Rating,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { TradeAdWithDetails } from '../../services/types';
import OfferTradeModal from './OfferTradeModal';

interface TradeAdDetailsModalProps {
  open: boolean;
  onClose: () => void;
  ad: TradeAdWithDetails;
}

const TradeAdDetailsModal: React.FC<TradeAdDetailsModalProps> = ({
  open,
  onClose,
  ad,
}) => {
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  // Получаем полное название condition
  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'MINT': return 'Mint Condition';
      case 'TLC': return 'Needs TLC (Tender Loving Care)';
      case 'GOOD': return 'Good Condition';
      case 'NIB': return 'New in Box';
      default: return condition;
    }
  };

  // Форматируем дату
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleOpenOffer = () => {
    setOfferModalOpen(true);
    onClose(); // Закрываем текущую модалку
  };

  const handleViewProfile = () => {
    // TODO: Переход на страницу профиля пользователя
    console.log('View profile of:', ad.user?.username);
    // window.location.href = `/profile/${ad.userId}`;
    alert('View Profile feature coming soon!'); // Заглушка
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Основное содержимое модалки */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
        }}
      >
        {/* Кнопка закрытия */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            color: '#560D30',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Контент */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Левая колонка - изображение */}
          <Box
            sx={{
              flex: 1,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={ad.photo || '/assets/default-figurine.png'}
              alt={ad.title}
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 'auto',
                borderRadius: '15px',
                boxShadow: '0 8px 32px rgba(86, 13, 48, 0.2)',
              }}
            />
          </Box>

          {/* Правая колонка - информация */}
          <Box
            sx={{
              flex: 1,
              padding: 4,
              backgroundColor: 'rgba(245, 245, 245, 0.5)',
              borderTopRightRadius: { xs: '20px', md: '0' },
              borderBottomRightRadius: '20px',
              borderBottomLeftRadius: { xs: '20px', md: '0' },
            }}
          >
            {/* Заголовок */}
            <Typography
              variant="h4"
              sx={{
                color: '#560D30',
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              {ad.title}
            </Typography>

            {/* Бейджи с информацией */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip
                label={`Series: ${ad.figurine?.series || 'Unknown'}`}
                sx={{
                  backgroundColor: '#EC2EA6',
                  color: 'white',
                  fontFamily: '"Nobile", sans-serif',
                }}
              />
              <Chip
                label={getConditionLabel(ad.condition)}
                sx={{
                  backgroundColor: '#560D30',
                  color: 'white',
                  fontFamily: '"Nobile", sans-serif',
                }}
              />
            </Box>

            {/* Описание */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  color: '#882253',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Description:
              </Typography>
              <Typography
                sx={{
                  color: '#560D30',
                  fontFamily: '"Nobile", sans-serif',
                  lineHeight: 1.6,
                }}
              >
                {ad.description || 'No description provided.'}
              </Typography>
            </Box>

            {/* Детали местоположения и даты */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#882253', fontSize: 20 }} />
                <Typography
                  sx={{
                    color: '#560D30',
                    fontFamily: '"Nobile", sans-serif',
                  }}
                >
                  {ad.location || 'Location not specified'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ color: '#882253', fontSize: 20 }} />
                <Typography
                  sx={{
                    color: '#560D30',
                    fontFamily: '"Nobile", sans-serif',
                  }}
                >
                  Posted: {formatDate(ad.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Информация о владельце */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  color: '#882253',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Owner Information:
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  src={ad.user?.profile?.avatar}
                  sx={{
                    width: 60,
                    height: 60,
                    border: '2px solid #EC2EA6',
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      color: '#560D30',
                      fontFamily: '"McLaren", cursive',
                      fontSize: '18px',
                      mb: 0.5,
                    }}
                  >
                    {ad.user?.username || 'Unknown User'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        fontSize: '14px',
                      }}
                    >
                      ({ad.user?.profile?.rating?.toFixed(1) || '0.0'}/5.0)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Кнопки действий */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                onClick={handleViewProfile}
                variant="outlined"
                startIcon={<PersonIcon />}
                sx={{
                  color: '#560D30',
                  borderColor: '#560D30',
                  borderRadius: '10px',
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 400,
                  textTransform: 'none',
                  flex: { xs: '1 0 100%', sm: '1' },
                  minWidth: '150px',
                  '&:hover': {
                    borderColor: '#560D30',
                    backgroundColor: 'rgba(86, 13, 48, 0.1)',
                  },
                }}
              >
                View Profile
              </Button>
              
              <Button
                onClick={handleOpenOffer}
                variant="contained"
                startIcon={<MessageIcon />}
                sx={{
                  backgroundColor: '#EC2EA6',
                  color: 'white',
                  borderRadius: '10px',
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 400,
                  textTransform: 'none',
                  flex: { xs: '1 0 100%', sm: '1' },
                  minWidth: '150px',
                  '&:hover': {
                    backgroundColor: '#F056B7',
                  },
                }}
              >
                Offer Trade
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Модальное окно для предложения обмена */}
      <OfferTradeModal
        open={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        ad={ad}
      />
    </Box>
  );
};

export default TradeAdDetailsModal;