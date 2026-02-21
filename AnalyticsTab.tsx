import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsTabProps {
  stats: any;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ stats }) => {
  // Демо данные для графиков (позже заменить на реальные с бэка)
  const userGrowthData = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 200 },
    { month: 'Apr', users: 280 },
    { month: 'May', users: 350 },
    { month: 'Jun', users: 420 },
  ];

  const tradeCategoryData = [
    { name: 'MINT', value: 45 },
    { name: 'GOOD', value: 30 },
    { name: 'TLC', value: 15 },
    { name: 'NIB', value: 10 },
  ];

  const COLORS = ['#EC2EA6', '#4CAF50', '#FF9800', '#2196F3'];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"McLaren", cursive', color: '#560D30', mb: 3 }}>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#560D30', mb: 2 }}>
              User Growth (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#EC2EA6" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#560D30', mb: 2 }}>
              Trades by Condition
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tradeCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {tradeCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#560D30', mb: 2 }}>
              Key Metrics
            </Typography>
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