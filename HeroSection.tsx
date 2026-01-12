import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '400px', md: '545px' },
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Фоновое изображение */}
      <Box
        component="img"
        src="/assets/home-banner.png"
        alt="Hero background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      
      {/* Темный оверлей для лучшей читаемости текста */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(86, 13, 48, 0.7) 0%, transparent 100%)',
          zIndex: 1,
        }}
      />
      
      <Container
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 2,
          color: 'white',
          px: { xs: 2, md: 4 },
          maxWidth: '1280px !important',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '5rem' },
            fontFamily: '"Rammetto One", cursive',
            fontWeight: 400,
            mb: 3,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            color: '#F056B7',
          }}
        >
          Collector Mingle
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            maxWidth: '411px',
            mb: 4,
            fontSize: '1rem',
            fontFamily: '"Nobile", sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          A cozy place where collectors meet, swap treasures, and make new friends
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: '#F056B7',
            color: '#560D30',
            fontSize: '1rem',
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            px: 4,
            py: 1,
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#EC2EA6',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;