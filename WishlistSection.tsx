import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const WishlistSection: React.FC = () => {
  return (
    <Container 
      sx={{ 
        py: { xs: 6, md: 8 },
        maxWidth: '1280px !important',
      }}
    >
      <Grid container spacing={6} alignItems="center">
        {/* Left Images with decorative SVG */}
         {/* @ts-ignore */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'relative', height: '300px' }}>
            {/* Decorative SVG */}
            <Box
              component="img"
              src="/assets/wishlist-left.svg"
              alt=""
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: 'auto',
                zIndex: 1,
              }}
            />
          </Box>
        </Grid>

        {/* Center Content */}
         {/* @ts-ignore */}
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '3rem', md: '4.5rem', lg: '5rem' },
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                mb: 4,
                color: '#560D30',
              }}
            >
              Wishlist
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <RadioButtonUncheckedIcon sx={{ color: '#82164A', fontSize: '1.5rem' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#82164A', 
                    fontSize: '1rem',
                    fontFamily: '"Nobile", sans-serif',
                    lineHeight: '30px',
                  }}
                >
                  Wish it
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <RadioButtonUncheckedIcon sx={{ color: '#82164A', fontSize: '1.5rem' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#82164A', 
                    fontSize: '1rem',
                    fontFamily: '"Nobile", sans-serif',
                    lineHeight: '30px',
                  }}
                >
                  List it
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon sx={{ color: '#F056B7', fontSize: '1.5rem' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#F056B7', 
                    fontSize: '1rem',
                    fontFamily: '"Nobile", sans-serif',
                    lineHeight: '30px',
                    fontWeight: 600,
                  }}
                >
                  Trade it
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Images with decorative SVG */}
         {/* @ts-ignore */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'relative', height: '300px' }}>
            {/* Decorative SVG */}
            <Box
              component="img"
              src="/assets/wishlist-right.svg"
              alt=""
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: 'auto',
                zIndex: 1,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WishlistSection;