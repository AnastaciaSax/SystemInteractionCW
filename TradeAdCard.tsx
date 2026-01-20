// client/src/components/cards/TradeAdCard.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { TradeAdWithDetails } from '../../services/types';
import OfferTradeModal from './OfferTradeModal';

interface TradeAdCardProps {
  ad: TradeAdWithDetails;
  isOwner?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: any) => Promise<void>;
}

const TradeAdCard: React.FC<TradeAdCardProps> = ({ ad }) => {
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const handleOfferTrade = () => {
    setOfferModalOpen(true);
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
          }}
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
            onClick={handleOfferTrade}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: '#F05EBA',
              borderRadius: '50%',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: '#F056B7',
              },
            }}
          >
            {/* Крестик (плюс) - белый */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Горизонтальная линия */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '70%',
                  height: '4px',
                  backgroundColor: 'white',
                  borderRadius: '2px',
                }}
              />
              {/* Вертикальная линия */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '4px',
                  height: '70%',
                  backgroundColor: 'white',
                  borderRadius: '2px',
                }}
              />
            </Box>
          </IconButton>
        </Box>
      </Box>

      {/* Модальное окно Offer trade */}
      <OfferTradeModal
        open={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        ad={ad}
      />
    </>
  );
};

export default TradeAdCard;