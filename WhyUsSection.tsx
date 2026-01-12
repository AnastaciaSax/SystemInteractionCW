import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';

const WhyUsSection: React.FC = () => {
  const features = [
    {
      icon: '/assets/why-us-1.svg',
      title: 'Safe Trade',
      description: 'Secure trading with verified users and feedback system',
    },
    {
      icon: '/assets/why-us-2.svg',
      title: 'Easy Search',
      description: 'Powerful filters to find exactly what you need',
    },
    {
      icon: '/assets/why-us-3.svg',
      title: 'Friendly Community',
      description: 'Connect with fellow collectors worldwide',
    },
    {
      icon: '/assets/why-us-4.svg',
      title: 'Wishlist Magic',
      description: 'Track your dream items and get notified',
    },
  ];

  return (
    <Container 
      sx={{ 
        py: { xs: 6, md: 8 },
        maxWidth: '1280px !important',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          fontSize: { xs: '3rem', md: '4.5rem', lg: '5rem' },
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          mb: 8,
          color: '#560D30',
        }}
      >
        Why Us?
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 4,
      }}>
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 3,
              borderRadius: 4,
              backgroundColor: 'transparent',
              boxShadow: 'none',
              '&:hover .feature-icon': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {/* SVG Icon */}
            <Box
              className="feature-icon"
              sx={{
                width: '175px',
                height: '175px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                transition: 'transform 0.3s ease',
              }}
            >
              <Box
                component="img"
                src={feature.icon}
                alt={feature.title}
                sx={{ width: '100%', height: '100%' }}
              />
            </Box>
            
            <CardContent sx={{ flexGrow: 1, p: 0 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  color: '#82164A',
                  fontSize: '20px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 400,
                  lineHeight: '30px',
                }}
              >
                {feature.title}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: '#82164A',
                  opacity: 0.8,
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                }}
              >
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default WhyUsSection;