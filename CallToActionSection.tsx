import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useNavigate } from 'react-router-dom';

const CallToActionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container 
      sx={{ 
        py: { xs: 6, md: 8 },
        maxWidth: '1280px !important',
      }}
    >
      <Grid container spacing={6} alignItems="center">
        {/* Left Content */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={7}>
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                mb: 4,
                color: '#560D30',
              }}
            >
              Ready To Mingle?
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: '#82164A',
                mb: 6,
                maxWidth: '449px',
                fontSize: '20px',
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                lineHeight: '30px',
              }}
            >
              Start trading, sharing and smiling together — it's free and fun!
            </Typography>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/sign-in')}
                sx={{
                  backgroundColor: '#F056B7',
                  color: 'white',
                  width: '168px',
                  height: '48px',
                  fontSize: '16px',
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 400,
                  borderRadius: '10px',
                  boxShadow: '0px 4px 4px rgba(153, 242, 247, 0.39)',
                  '&:hover': {
                    backgroundColor: '#EC2EA6',
                  },
                }}
              >
                Sign In
              </Button>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<HowToRegIcon />}
                onClick={() => navigate('/check-in')}
                sx={{
                  backgroundColor: '#82164A',
                  color: '#FFF6F9',
                  width: '168px',
                  height: '48px',
                  fontSize: '16px',
                  fontFamily: '"McLaren", cursive',
                  fontWeight: 400,
                  borderRadius: '10px',
                  boxShadow: '0px 4px 4px rgba(153, 242, 247, 0.39)',
                  '&:hover': {
                    backgroundColor: '#560D30',
                  },
                }}
              >
                Check In
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Image */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: '300px', md: '440px' },
              width: '100%',
            }}
          >
            <Box
              component="img"
              src="/assets/ready-to-mingle.png"
              alt="Ready to mingle"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CallToActionSection;