import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection';
import TradeSection from './components/TradeSection';
import WishlistSection from './components/WishlistSection';
import WhyUsSection from './components/WhyUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CallToActionSection from './components/CallToActionSection';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        minHeight: '100%',
      }}
    >
      <HeroSection />
      <TradeSection />
      <WishlistSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CallToActionSection />
    </Box>
  );
};

export default Home;