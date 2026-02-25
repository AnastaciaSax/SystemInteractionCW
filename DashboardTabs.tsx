import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
    Category as CategoryIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import OverviewTab from './tabs/OverviewTab';
import UsersTab from './tabs/UsersTab';
import ArticlesTab from './tabs/ArticlesTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import ReportsTab from './tabs/ReportsTab';
import FigurinesTab from './tabs/FigurinesTab';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: any;
  recentActivity: any[];
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  stats,
  recentActivity,
  onShowNotification
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'users', label: 'Users', icon: <PeopleIcon /> },
    { id: 'articles', label: 'Articles', icon: <ArticleIcon /> },
        { id: 'figurines', label: 'Figurines', icon: <CategoryIcon /> }, 
    { id: 'analytics', label: 'Analytics', icon: <TrendingUpIcon /> },
    { id: 'reports', label: 'Reports', icon: <ReceiptIcon /> }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            stats={stats}
            recentActivity={recentActivity}
          />
        );
      case 'users':
        return (
          <UsersTab 
            onShowNotification={onShowNotification}
          />
        );
      case 'articles':
        return (
          <ArticlesTab 
            onShowNotification={onShowNotification}
          />
        );
              case 'figurines':
        return <FigurinesTab onShowNotification={onShowNotification} />;
      case 'analytics':
        return (
          <AnalyticsTab 
            stats={stats}
          />
        );
      case 'reports':
        return (
          <ReportsTab 
            onShowNotification={onShowNotification}
          />
        );
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Select a tab to view content</Typography>
          </Box>
        );
    }
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(236, 46, 166, 0.1)'
      }}
    >
      {/* Вкладки */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: '#F8FFFF'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#EC2EA6',
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              minHeight: 64,
              fontFamily: '"McLaren", cursive',
              color: '#560D30',
              opacity: 0.7,
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 1,
                backgroundColor: 'rgba(236, 46, 166, 0.05)'
              },
              '&.Mui-selected': {
                color: '#EC2EA6',
                opacity: 1
              }
            }
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              icon={tab.icon}
              iconPosition="start"
              label={!isMobile ? tab.label : undefined}
              sx={{
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Контент вкладки */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {renderTabContent()}
      </Box>
    </Paper>
  );
};

export default DashboardTabs;