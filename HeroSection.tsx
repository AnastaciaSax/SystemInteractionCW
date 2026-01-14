import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '500px', md: '545px' },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
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
      
      {/* Контейнер для контента - растягиваем на всю высоту */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Подложка - увеличиваем ширину для десктопа */}
        <Box
          sx={{
            width: { xs: '100%', sm: '90%', md: '750px' }, // Увеличили с 670px до 750px
            maxWidth: '750px', // Увеличили максимальную ширину
            margin: '0 auto',
            height: { xs: '200px', sm: '220px', md: '252px' },
            backgroundColor: 'rgba(86, 13, 48, 0.57)',
            borderTopLeftRadius: '45px',
            borderTopRightRadius: '45px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: { xs: '20px 16px', md: '20px 30px' },
            boxSizing: 'border-box',
            // Для мобильных - добавляем небольшие отступы по бокам
            mx: { xs: 2, sm: 'auto' },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { 
                xs: '1.75rem', 
                sm: '2.25rem', 
                md: '2.5rem', 
                lg: '3.5rem' // Уменьшили с 4rem до 3.5rem (56px)
              },
              fontFamily: '"Rammetto One", cursive',
              fontWeight: 400,
              color: '#F056B7',
              lineHeight: 1,
              mb: { xs: 1, md: 2 },
              maxWidth: '100%',
              // Убираем обрезание текста
              whiteSpace: 'nowrap',
              overflow: 'visible', // Меняем с hidden на visible
              textOverflow: 'clip', // Меняем с ellipsis на clip
              // Динамическое уменьшение размера текста если не влезает
              '@media (max-width: 1280px)': {
                fontSize: '3.25rem',
              },
              '@media (max-width: 1100px)': {
                fontSize: '2.75rem',
                whiteSpace: 'normal',
              },
              '@media (max-width: 900px)': {
                fontSize: '2.5rem',
              },
            }}
          >
            Collector Mingle
          </Typography>
          
          <Typography
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
              fontFamily: '"Nobile", sans-serif',
              fontWeight: 400,
              color: 'white',
              lineHeight: 1.4,
              mb: { xs: 2, md: 3 },
              maxWidth: { xs: '95%', sm: '411px' },
              px: { xs: 1, sm: 0 },
            }}
          >
            A cozy place where collectors meet, swap treasures, and make new friends
          </Typography>
          
          <Button
            variant="contained"
            size="medium"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: '#F056B7',
              color: '#560D30',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              px: { xs: 3, md: 4 },
              py: { xs: 0.5, md: 1 },
              borderRadius: '10px',
              minWidth: '143px',
              '&:hover': {
                backgroundColor: '#EC2EA6',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;