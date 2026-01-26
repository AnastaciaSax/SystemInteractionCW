// client/src/components/cards/WishlistSkeleton.tsx
import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface WishlistSkeletonProps {
  count?: number;
}

const WishlistSkeleton: React.FC<WishlistSkeletonProps> = ({ count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {skeletons.map((index) => (
        <Card
          key={index}
          sx={{
            width: '100%',
            maxWidth: 412,
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <Skeleton variant="rectangular" height={412} />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="circular" width={60} height={60} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default WishlistSkeleton;