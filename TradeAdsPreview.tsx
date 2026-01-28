import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import TradeAdCard from '../../../components/cards/TradeAdCard';

interface TradeAdsPreviewProps {
  tradeAds: any[];
  username: string;
}

const TradeAdsPreview: React.FC<TradeAdsPreviewProps> = ({ tradeAds, username }) => {
  return (
    <Box sx={{ mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: 'var(--title, #560D30)',
            fontSize: { xs: '28px', md: '36px' },
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
          }}
        >
          {username}'s TradeAds 🏷️
        </Typography>
        
        <Typography
          component={Link}
          to="/trade"
          sx={{
            color: '#EC2EA6',
            fontSize: '16px',
            fontFamily: '"Nobile", sans-serif',
            fontWeight: 400,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          View all →
        </Typography>
      </Box>

      {tradeAds.length > 0 ? (
        <Grid container spacing={3}>
          {tradeAds.slice(0, 3).map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <TradeAdCard 
                ad={ad}
                showActions={false}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography
            sx={{
              color: '#852654',
              fontSize: '18px',
              fontFamily: '"Nobile", sans-serif',
              fontStyle: 'italic',
            }}
          >
            No trade ads yet. Start trading to expand your collection! 🔄
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TradeAdsPreview;