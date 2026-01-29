import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import WishlistCard from '../../../components/cards/WishlistCard';

interface WishlistPreviewProps {
  wishlist: any[];
  username: string;
}

const WishlistPreview: React.FC<WishlistPreviewProps> = ({ wishlist, username }) => {
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
          {username}'s Wishlist Dreams 🎯
        </Typography>
        
        <Typography
          component={Link}
          to="/wishlist"
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

      {wishlist.length > 0 ? (
        <Grid container spacing={3}>
          {wishlist.slice(0, 3).map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <WishlistCard 
                figurine={item.figurine}
                isInWishlist={true}
                wishlistNote={item.note}
                wishlistItemId={item.id}
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
            No wishlist items yet. Dreams are waiting to be added! 💭
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WishlistPreview;