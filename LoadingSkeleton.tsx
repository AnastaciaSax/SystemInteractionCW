import React from 'react';
import { Box, Container, Skeleton, Grid, Paper } from '@mui/material';
import Header from '../../../components/Layout/Header';
import Footer from '../../../components/Layout/Footer';

const LoadingSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#F8FFFF', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container sx={{ maxWidth: '1400px !important', py: 5, flex: 1 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 4 }} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Skeleton variant="circular" width={50} height={50} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={400} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default LoadingSkeleton;