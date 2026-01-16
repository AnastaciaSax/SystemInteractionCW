// src/pages/SignIn/SignIn.tsx
import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import SignInForm from './components/SignInForm';

const SignIn: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <PageBanner
        title="Sign In"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Sign In' },
        ]}
      />

      <Container
        sx={{
          maxWidth: '1280px !important',
          py: { xs: 4, sm: 6, md: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <SignInForm />

        {/* Ссылка на регистрацию */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            sx={{
              color: '#82164A',
              fontSize: '16px',
              fontFamily: '"Nobile", sans-serif',
            }}
          >
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/check-in"
              sx={{
                color: '#EC2EA6',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.2s',
                '&:hover': {
                  borderBottom: '1px solid #EC2EA6',
                },
              }}
            >
              Check in!
            </Link>
          </Typography>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default SignIn;