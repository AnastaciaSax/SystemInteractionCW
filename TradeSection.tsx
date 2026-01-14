import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia } from '@mui/material';

const TradeSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Примерные данные для слайдов - замените на реальные
  const slides = [
    { id: 1, image: '/assets/ad1.png', title: 'Wolf / Persian Cat' },
    { id: 2, image: '/assets/ad2.png', title: 'Blue Sky Poodle' },
    { id: 3, image: '/assets/ad3.png', title: 'Mint Polar Bear' },
    { id: 4, image: '/assets/ad4.png', title: 'Australian Edition Dachshund' },
    { id: 5, image: '/assets/ad5.png', title: 'Gentle Maltese' },
    { id: 6, image: '/assets/ad6.png', title: 'Stripped Kitty Dressed' },
    { id: 7, image: '/assets/ad7.png', title: 'Mystery Figure' },
  ];

  // Рассчитываем сколько слайдов показывать в зависимости от размера экрана
  const getSlidesPerView = () => {
    if (typeof window === 'undefined') return 2.5;
    if (window.innerWidth < 600) return 1.2; // На мобильных показываем 1.2 слайда
    if (window.innerWidth < 960) return 2; // На планшетах показываем 2 слайда
    return 2.5; // На десктопе показываем 2.5 слайда
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  // Обновляем slidesPerView при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Автоматическая прокрутка
  useEffect(() => {
    if (!isPaused && slides.length > slidesPerView) {
      autoScrollRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev >= slides.length - Math.floor(slidesPerView)) {
            return 0;
          }
          return prev + 1;
        });
      }, 4000); // Прокрутка каждые 4 секунды
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, slides.length, slidesPerView]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Рассчитываем ширину слайда в процентах
  const slideWidth = 100 / slidesPerView;

  return (
    <Container 
      sx={{ 
        py: { xs: 6, md: 8 },
        maxWidth: '1280px !important',
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left side - Text */}
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
        <Grid item xs={12} md={7}>
          <Box 
            sx={{ 
              position: 'relative',
              pr: { md: 6 },
              overflow: 'hidden',
              // Фиксируем высоту контейнера слайдера для десктопа
              height: { xs: 'auto', md: '460px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Slides Container */}
            <Box
              ref={sliderRef}
              sx={{
                display: 'flex',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentSlide * slideWidth}%)`,
                willChange: 'transform',
                // Для десктопа фиксируем высоту контейнера слайдов
                alignItems: 'center',
                height: { xs: 'auto', md: '300px' },
              }}
            >
              {slides.map((slide, index) => (
                <Box
                  key={slide.id}
                  sx={{
                    flex: `0 0 ${slideWidth}%`,
                    padding: { xs: '4px', md: '8px' },
                    transition: 'all 0.3s ease',
                    // Для десктопа - фиксированная высота 300px
                    height: { xs: 'auto', md: '300px' },
                  }}
                >
                  <Card
                    sx={{
                      borderRadius: { xs: '24px', md: '46px' },
                      overflow: 'hidden',
                      // Фиксированные размеры для десктопа
                      height: { xs: '220px', sm: '280px', md: '300px' },
                      width: { xs: '100%', md: '300px' }, // Фиксируем ширину на десктопе
                      position: 'relative',
                      boxShadow: index >= currentSlide && index < currentSlide + slidesPerView 
                        ? '0 8px 24px rgba(0, 0, 0, 0.15)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transform: index >= currentSlide && index < currentSlide + slidesPerView 
                        ? 'scale(1)' 
                        : 'scale(0.95)',
                      opacity: index >= currentSlide && index < currentSlide + slidesPerView 
                        ? 1 
                        : 0.7,
                      // Центрируем слайд внутри его контейнера
                      margin: '0 auto',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={slide.image}
                      alt={slide.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    {/* Наложение с названием фигурки */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: { xs: '12px', md: '16px' },
                        color: 'white',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          fontFamily: '"McLaren", cursive',
                          fontWeight: 400,
                          textAlign: 'center',
                        }}
                      >
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Dots Indicator (как в макете - большие круги с маленькими точками) */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 4,
              }}
            >
              {slides.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 3000);
                  }}
                  sx={{
                    width: { xs: '36px', md: '48px' },
                    height: { xs: '36px', md: '48px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: '6px', md: '10px' },
                      height: { xs: '6px', md: '10px' },
                      borderRadius: '50%',
                      backgroundColor: '#560D30',
                      opacity: index === currentSlide ? 1 : 0.5,
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradeSection;