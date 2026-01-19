// client/src/components/cards/TradeAdSkeleton/TradeAdSkeleton.tsx
import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface TradeAdSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list';
}

const TradeAdSkeleton: React.FC<TradeAdSkeletonProps> = ({ count = 1, variant = 'grid' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'list') {
    return (
      <>
        {skeletons.map((index) => (
          <Card key={index} sx={{ mb: 2, borderRadius: '10px' }}>
            <CardContent sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: '8px' }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" />
              </Box>
              <Skeleton variant="circular" width={50} height={50} />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  // Grid variant (default)
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
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
              <Skeleton variant="circular" width={60} height={60} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="70%" height={20} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default TradeAdSkeleton;