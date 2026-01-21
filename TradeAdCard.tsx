// client/src/components/cards/TradeAdCard.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { TradeAdWithDetails } from '../../services/types';
import TradeAdDetailsModal from './TradeAdDetailsModal';

// Упрощаем интерфейс, оставляем только ad
interface TradeAdCardProps {
  ad: TradeAdWithDetails;
}

const TradeAdCard: React.FC<TradeAdCardProps> = ({ ad }) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDetailsClick = () => {
    setDetailsModalOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          maxWidth: 412,
          display: 'flex',
          flexDirection: 'column',
          gap: '17px',
        }}
      >
        {/* Изображение фигурки */}
        <Box
          component="img"
          src={ad.photo || '/assets/default-figurine.png'}
          alt={ad.title}
          sx={{
            width: '100%',
            height: { xs: 300, sm: 350, md: 412 },
            objectFit: 'cover',
            borderRadius: '10px',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
          onClick={handleDetailsClick}
        />

        {/* Информация и кнопка Offer trade */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Информация */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: '#560D30',
                fontSize: '20px',
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                lineHeight: 1.2,
                mb: 0.5,
                textAlign: 'left',
              }}
            >
              {ad.title}
            </Typography>
            <Typography
              sx={{
                color: '#882253',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                mb: 0.5,
                textAlign: 'left',
              }}
            >
              Condition: {ad.condition}
            </Typography>
            <Typography
              sx={{
                color: '#882253',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                textAlign: 'left',
              }}
            >
              Series: {ad.figurine?.series || 'Unknown'}
            </Typography>
          </Box>

          {/* Кнопка Offer trade */}
          <IconButton
            onClick={handleDetailsClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              padding: 0,
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={isHovered 
                  ? '/assets/offer-trade-active.svg' 
                  : '/assets/offer-trade-default.svg'
                }
                alt="Offer trade"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'all 0.2s ease',
                }}
              />
            </Box>
          </IconButton>
        </Box>
      </Box>

      {/* Модальное окно с деталями объявления */}
      <TradeAdDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        ad={ad}
      />
    </>
  );
};

export default TradeAdCard;