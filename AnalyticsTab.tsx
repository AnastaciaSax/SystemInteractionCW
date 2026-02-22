import React from 'react';
import { Box, Paper, Typography, Grid, Divider } from '@mui/material';

interface AnalyticsTabProps {
  stats: any;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ stats }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"McLaren", cursive', color: '#560D30', mb: 3 }}>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#560D30', mb: 2 }}>
              Key Metrics
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#EC2EA6' }}>{stats?.userGrowth?.toFixed(1)}%</Typography>
                  <Typography variant="body2">User Growth Rate</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4CAF50' }}>{stats?.tradeGrowth?.toFixed(1)}%</Typography>
                  <Typography variant="body2">Trade Growth Rate</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2196F3' }}>{stats?.articleGrowth?.toFixed(1)}%</Typography>
                  <Typography variant="body2">Article Growth Rate</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#FF9800' }}>{stats?.revenueGrowth?.toFixed(1)}%</Typography>
                  <Typography variant="body2">Revenue Growth</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsTab;