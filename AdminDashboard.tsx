import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Settings as SettingsIcon,
   Category as CategoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import Notification from '../../components/ui/Notification';
import StatCard from './components/StatCard';
import DashboardTabs from './components/DashboardTabs';
import ExportModal from './components/tabs/ExportModal';
import QuickActions from './components/QuickActions';
import LoadingSkeleton from './components/LoadingSkeleton';
import { adminAPI } from '../../services/adminApi';
import './AdminDashboard.css';
import { User } from '../../services/types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Проверка прав администратора
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      showNotification('Access denied. Admin privileges required.', 'error');
    }
  }, [user, navigate]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      open: true,
      message,
      type
    });
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (user?.role !== 'ADMIN') return;
    
    setLoading(true);
    try {
const [statsData, activityData] = await Promise.all([
  adminAPI.getDashboardStats(),
  adminAPI.getRecentActivity()
]);
      
      setStats(statsData);
      setRecentActivity(activityData.slice(0, 10));
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showNotification]);

useEffect(() => {
  const interval = setInterval(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardData(); // перезапрашиваем данные
    }
  }, 5000); // 5 секунд

  return () => clearInterval(interval);
}, [fetchDashboardData, user]);

  const handleExport = (format: 'pdf' | 'csv', reportType: string) => {
    adminAPI.exportReport(reportType, format)
      .then(() => {
        showNotification(`Report exported successfully as ${format.toUpperCase()}`, 'success');
      })
      .catch(error => {
        showNotification(`Export failed: ${error.message}`, 'error');
      });
    setExportModalOpen(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'refresh':
        fetchDashboardData();
        showNotification('Dashboard data refreshed', 'success');
        break;
      case 'export':
        setExportModalOpen(true);
        break;
      default:
        break;
    }
  };

  if (loading && !stats) {
    return <LoadingSkeleton />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
                background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header />
      
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        duration={3000}
      />

      <PageBanner
        title="Admin Dashboard"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Admin' },
        ]}
        imageUrl="/assets/banner-admin.png"
      />

      <Container
        sx={{
          maxWidth: '1400px !important',
          py: { xs: 3, sm: 4, md: 5 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {/* Заголовок и быстрые действия */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"McLaren", cursive',
                color: '#560D30',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
              }}
            >
              Welcome back, {user?.username || 'Admin'}! 👋
            </Typography>
            <Typography
              sx={{
                color: '#852654',
                fontFamily: '"Nobile", sans-serif',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Manage your platform and monitor activity
            </Typography>
          </Box>
          
          <QuickActions onAction={handleQuickAction} />
        </Box>

        {/* Статистика в реальном времени */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                change={stats.userGrowth}
                icon={<PeopleIcon />}
                color="#A50050"
                onClick={() => setActiveTab('users')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Trades"
                value={stats.activeTrades}
                change={stats.tradeGrowth}
                icon={<TrendingUpIcon />}
                color="#EC2EA6"
                onClick={() => setActiveTab('trades')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Articles"
                value={stats.totalArticles}
                change={stats.articleGrowth}
                icon={<ArticleIcon />}
                color="#3960ba"
                onClick={() => setActiveTab('articles')}
              />
            </Grid>
<Grid item xs={12} sm={6} md={3}>
  <StatCard
    title="Total Figurines"
    value={stats.totalFigurines}
    change={stats.figurineGrowth}
    icon={<CategoryIcon />}
    color="#4CAF50"  // можно оставить зелёный или выбрать другой, например #EC2EA6
    onClick={() => setActiveTab('figurines')}
  />
</Grid>
          </Grid>
        )}

        {/* Основной контент с вкладками */}
        <DashboardTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
          recentActivity={recentActivity}
          onShowNotification={showNotification}
        />

        {/* Уведомление о необходимости верификации */}
        {user && !user.isVerified && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 3,
              '& .MuiAlert-icon': { color: '#FFC107' }
            }}
          >
            <Typography sx={{ fontFamily: '"Nobile", sans-serif' }}>
              Your admin account is not verified. Please contact the system admin.
            </Typography>
          </Alert>
        )}
      </Container>

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
      />

      <Footer />
    </Box>
  );
};

export default AdminDashboard;