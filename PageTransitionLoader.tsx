import React from 'react';
import { Box } from '@mui/material';

const PageTransitionLoader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box
        component="img"
        src="/assets/paw-preloader.gif"
        alt="Loading..."
        sx={{
          width: 100,
          height: 100,
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default PageTransitionLoader;