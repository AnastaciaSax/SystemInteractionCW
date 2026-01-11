import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean; // Для Home страницы нужен другой контейнер
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8FFFF',
      }}
    >
      <Header />
      
      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
        }}
      >
        {fullWidth ? (
          // Для Home страницы - без дополнительного контейнера
          children
        ) : (
          // Для других страниц - с контейнером
          <Container
            maxWidth="xl"
            sx={{
              py: { xs: 3, sm: 4, md: 5 },
              px: { xs: 2, sm: 3, md: 4, lg: 6 },
              maxWidth: '1400px !important',
            }}
          >
            {children}
          </Container>
        )}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;