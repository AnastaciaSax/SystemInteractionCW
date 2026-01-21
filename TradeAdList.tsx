// client/src/pages/Trade/components/TradeAdList.tsx
import React from 'react';
import {
  Box,
  Grid,
  Typography,
} from '@mui/material';
import TradeAdCard from '../../../components/cards/TradeAdCard';
import TradeAdSkeleton from '../../../components/cards/TradeAdSkeleton'; 
import { TradeAdWithDetails } from '../../../services/types'; // Добавляем импорт типа

interface TradeAdListProps {
  ads: TradeAdWithDetails[]; // Используем конкретный тип
  loading: boolean;
  isOwner?: (ad: TradeAdWithDetails) => boolean;
  onDeleteAd?: (id: string) => Promise<void>;
  onUpdateAd?: (id: string, data: any) => Promise<void>;
}

const TradeAdList: React.FC<TradeAdListProps> = ({
  ads,
  loading,
  isOwner,
  onDeleteAd,
  onUpdateAd,
}) => {
  if (loading) {
    return (
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TradeAdSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (ads.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          textAlign: 'center',
          padding: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#560D30',
            fontFamily: '"McLaren", cursive',
            mb: 2,
          }}
        >
          No trade ads found
        </Typography>
        <Typography
          sx={{
            color: '#82164A',
            fontFamily: '"Nobile", sans-serif',
            maxWidth: '400px',
          }}
        >
          Try adjusting your filters or create the first trade ad!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 3, md: 4 }}>
      {ads.map((ad) => (
        <Grid item xs={12} sm={6} md={4} key={ad.id}>
          <TradeAdCard ad={ad} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TradeAdList;