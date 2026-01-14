import React from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Layout/Header';
import HeroSection from './components/HeroSection';
import TradeSection from './components/TradeSection';
import WishlistSection from './components/WishlistSection';
import WhyUsSection from './components/WhyUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CallToActionSection from './components/CallToActionSection';
import Footer from '../../components/Layout/Footer';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        minHeight: '100%',
        // Отступы по краям для desktop
        padding: {
          xs: '0 16px',
          sm: '0 24px',
          md: '0 40px',
          lg: '0 60px',
          xl: '0 80px',
        },
      }}
    >
      <Header />
      <HeroSection />
      <TradeSection />
      <WishlistSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
    </Box>
  );
};

export default Home;