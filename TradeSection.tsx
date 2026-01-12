import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';

const TradeSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 7;
  const slidesPerView = 3;

  const slides = Array.from({ length: totalSlides }, (_, i) => ({
    id: i,
    image: `/assets/ad${i + 1}.png`,
    title: `Trade Item ${i + 1}`,
  }));

  return (
    <Container 
      sx={{ 
        py: { xs: 6, md: 8 },
        maxWidth: '1280px !important',
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left side - Text */}
                  {/* @ts-ignore */}
        <Grid item xs={12} md={4}>
          <Box sx={{ pl: { md: 6 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '3rem', md: '4.5rem', lg: '5rem' },
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                mb: 3,
                color: '#560D30',
              }}
            >
              Trade
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                color: '#82164A',
                maxWidth: '282px',
                fontFamily: '"Nobile", sans-serif',
              }}
            >
              Your figure treasured might be just one swap away!
            </Typography>
          </Box>
        </Grid>

        {/* Arrow in middle */}
                  {/* @ts-ignore */}
        <Grid item xs={12} md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src="/assets/home-trade-arrow.svg"
              alt="Arrow"
              sx={{ width: '60px', height: '60px' }}
            />
          </Box>
        </Grid>

        {/* Right side - Slider */}
                  {/* @ts-ignore */}
        <Grid item xs={12} md={7}>
          <Box sx={{ position: 'relative', pr: { md: 6 } }}>
            {/* Slides Container */}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                overflow: 'hidden',
                pb: 4,
              }}
            >
              {slides
                .slice(currentSlide, currentSlide + slidesPerView)
                .map((slide) => (
                  <Card
                    key={slide.id}
                    sx={{
                      flex: '0 0 calc(33.333% - 16px)',
                      borderRadius: '46px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={slide.image}
                      alt={slide.title}
                      sx={{
                        height: { xs: '200px', sm: '250px', md: '300px' },
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Card>
                ))}
            </Box>

            {/* Dots Indicator */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mt: 2,
              }}
            >
              {Array.from({ length: totalSlides - slidesPerView + 1 }).map(
                (_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    sx={{
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#560D30',
                        opacity: index === currentSlide ? 1 : 0.5,
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradeSection;