import React from 'react';
import {
  Box,
  Grid,
  Typography,
} from '@mui/material';
import WishlistCard from '../../../components/cards/WishlistCard';
import WishlistSkeleton from '../../../components/cards/WishlistSkeleton';

interface WishlistItemListProps {
  figurines: any[];
  loading: boolean;
  isInMyWishlist: (figurineId: string) => boolean;
  getWishlistNote: (figurineId: string) => string;
  getWishlistItemId: (figurineId: string) => string | null;
  onAddToWishlist: (figurineId: string, note?: string) => Promise<any>;
  onUpdateNote: (wishlistItemId: string, note: string) => Promise<void>;
  onRemoveFromWishlist: (wishlistItemId: string) => Promise<void>;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const WishlistItemList: React.FC<WishlistItemListProps> = ({
  figurines,
  loading,
  isInMyWishlist,
  getWishlistNote,
  getWishlistItemId,
  onAddToWishlist,
  onUpdateNote,
  onRemoveFromWishlist,
  onSuccess,
  onError,
}) => {
  if (loading) {
    return (
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <WishlistSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (figurines.length === 0) {
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
          No figurines found
        </Typography>
        <Typography
          sx={{
            color: '#82164A',
            fontFamily: '"Nobile", sans-serif',
            maxWidth: '400px',
          }}
        >
          Try adjusting your filters or add your first figurine to wishlist!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 3, md: 4 }}>
      {figurines.map((figurine) => (
        <Grid item xs={12} sm={6} md={4} key={figurine.id}>
          <WishlistCard 
            figurine={figurine}
            isInWishlist={isInMyWishlist(figurine.id)}
            wishlistNote={getWishlistNote(figurine.id)}
            wishlistItemId={getWishlistItemId(figurine.id)}
            onAddToWishlist={onAddToWishlist}
            onUpdateNote={onUpdateNote}
            onRemoveFromWishlist={onRemoveFromWishlist}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default WishlistItemList;