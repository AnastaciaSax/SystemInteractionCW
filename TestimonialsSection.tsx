import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Waters',
      location: 'Portland, USA',
      avatar: '/assets/avatar1.png',
      comment: 'I finally found that rare fox figure I\'ve been looking for! The trade was smooth, and my partner was so kind. This platform feels like a little home for collectors.',
    },
    {
      name: 'Amalia Stein',
      location: 'Berlin, Germany',
      avatar: '/assets/avatar2.png',
      comment: 'Trading here is such a joy — no stress, no worries. Everyone I\'ve met has been so friendly and honest. My wishlist is slowly turning into reality!',
    },
    {
      name: 'Luca Bianchi',
      location: 'Milan, Italy',
      avatar: '/assets/avatar3.png',
      comment: 'I love how cozy the whole experience feels. The design is adorable, and it\'s easy to chat and arrange swaps. I\'ve already met two new collector friends!',
    },
    {
      name: 'Sofia Raspber',
      location: 'St. Petersburg, RF',
      avatar: '/assets/avatar4.png',
      comment: 'It\'s amazing how safe and positive this space is. I used to trade only offline, but now I trust online exchanges too. Collector Mingle made it simple and warm.',
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
        Shared Stories
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
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              borderRadius: '40px',
              backgroundColor: 'rgba(153, 242, 247, 0.39)',
              border: 'none',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* User Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{ 
                    width: 86, 
                    height: 86, 
                    mr: 2,
                    borderRadius: '9999px',
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#82164A',
                      fontSize: '20px',
                      fontFamily: '"Nobile", sans-serif',
                      lineHeight: '30px',
                    }}
                  >
                    {testimonial.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      color: '#82164A',
                      fontSize: '16px',
                      fontFamily: '"Nobile", sans-serif',
                      letterSpacing: '0.48px',
                    }}
                  >
                    {testimonial.location}
                  </Typography>
                </Box>
              </Box>

              {/* Comment */}
              <Typography
                variant="body2"
                sx={{
                  color: '#804A64',
                  lineHeight: '30px',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                }}
              >
                {testimonial.comment}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default TestimonialsSection;