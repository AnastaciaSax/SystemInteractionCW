import React from 'react';
import { Box, Grid, Paper, Typography, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from '@mui/lab';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArticleIcon from '@mui/icons-material/Article';

interface OverviewTabProps {
  stats: any;
  recentActivity: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, recentActivity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'USER_REGISTERED':
        return <PersonAddIcon sx={{ color: '#4CAF50' }} />;
      case 'TRADE_CREATED':
        return <SwapHorizIcon sx={{ color: '#EC2EA6' }} />;
      case 'ARTICLE_PUBLISHED':
        return <ArticleIcon sx={{ color: '#2196F3' }} />;
      default:
        return <SwapHorizIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"McLaren", cursive', color: '#560D30', mb: 3 }}>
        Platform Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Краткая статистика */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#560D30', mb: 2 }}>
              Quick Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Total Users:</Typography>
                <Typography fontWeight="bold">{stats?.totalUsers}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Active Trades:</Typography>
                <Typography fontWeight="bold">{stats?.activeTrades}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Articles Published:</Typography>
                <Typography fontWeight="bold">{stats?.totalArticles}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Monthly Revenue:</Typography>
                <Typography fontWeight="bold" sx={{ color: '#4CAF50' }}>
                  ${stats?.revenue?.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Недавняя активность */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#560D30', mb: 2 }}>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Timeline position="right" sx={{ p: 0, m: 0 }}>
              {recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'transparent', boxShadow: 'none', p: 0 }}>
                      {getActivityIcon(activity.type)}
                    </TimelineDot>
                    {index < 4 && <TimelineConnector sx={{ bgcolor: '#EC2EA6' }} />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2" fontWeight="bold">{activity.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#852654' }}>
                      {activity.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={new Date(activity.timestamp).toLocaleDateString()}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem' }}
                      />
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewTab;