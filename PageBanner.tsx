// src/components/PageBanner.tsx
import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageBannerProps {
  title: string;
  breadcrumbs: Array<{ label: string; path?: string }>;
  background?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  breadcrumbs, 
  background = 'linear-gradient(180deg, #F6C4D4 0%, #96F2F7 100%)' 
}) => {
  return (
    <Box
      sx={{
        background,
        height: { xs: '200px', sm: '250px', md: '276px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'relative',
        width: '100%',
      }}
    >
      <Container
        sx={{
          maxWidth: '1280px !important',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: { xs: '90%', sm: '452px' },
            height: { xs: '130px', sm: '150px', md: '181px' },
            background: 'rgba(255, 255, 255, 0.57)',
            borderTopLeftRadius: '45px',
            borderTopRightRadius: '45px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              fontFamily: '"Rammetto One", cursive',
              color: '#560D30',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" sx={{ color: '#82164A' }} />}
            aria-label="breadcrumb"
            sx={{ 
              '& .MuiBreadcrumbs-ol': {
                justifyContent: 'center',
              }
            }}
          >
            {breadcrumbs.map((crumb, index) => (
              crumb.path ? (
                <Link
                  key={index}
                  component={RouterLink}
                  to={crumb.path}
                  underline="hover"
                  sx={{
                    color: '#82164A',
                    fontSize: '14px',
                    fontFamily: '"Nobile", sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: '#EC2EA6',
                    },
                  }}
                >
                  {crumb.label === 'Home'}
                  {crumb.label}
                </Link>
              ) : (
                <Typography
                  key={index}
                  sx={{
                    color: '#82164A',
                    fontSize: '14px',
                    fontFamily: '"Nobile", sans-serif',
                  }}
                >
                  {crumb.label}
                </Typography>
              )
            ))}
          </Breadcrumbs>
        </Box>
      </Container>
    </Box>
  );
};

export default PageBanner;