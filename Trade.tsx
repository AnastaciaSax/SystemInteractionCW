// client/src/pages/Trade/Trade.tsx
import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import TradeFilters from './components/TradeFilters';
import TradeAdList from './components/TradeAdList';
import Pagination from './components/Pagination';
import { tradeAPI } from '../../services/api';
import './Trade.css';

const Trade: React.FC = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    series: 'ALL',
    condition: 'ALL',
    region: 'ALL',
    view: 'ALL' // 'ALL' или 'MINE'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 6
  });

  // Получить текущего пользователя
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      let response: any;
      
      if (filters.view === 'MINE') {
        response = await tradeAPI.getMyAds();
        setAds(response.data || []);
        setPagination(prev => ({ 
          ...prev, 
          total: (response.data || []).length, 
          pages: 1 
        }));
      } else {
        response = await tradeAPI.getAds({
          page: pagination.page,
          limit: pagination.limit,
          series: filters.series !== 'ALL' ? filters.series : undefined,
          condition: filters.condition !== 'ALL' ? filters.condition : undefined,
          region: filters.region !== 'ALL' ? filters.region : undefined,
          search: filters.search || undefined
        });
        
        setAds(response.data?.ads || []);
        setPagination(prev => ({
          ...prev,
          total: response.data?.total || 0,
          pages: response.data?.pages || 1
        }));
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [filters, pagination.page]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleCreateAd = async (data: any) => {
    try {
      const response = await tradeAPI.createAd(data);
      if (response.data) {
        fetchAds(); // Обновляем список
        return Promise.resolve();
      }
    } catch (error) {
      console.error('Error creating ad:', error);
      return Promise.reject(error);
    }
  };

  const handleDeleteAd = async (id: string) => {
    try {
      await tradeAPI.deleteAd(id);
      fetchAds(); // Обновляем список
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const handleUpdateAd = async (id: string, data: any) => {
    try {
      await tradeAPI.updateAd(id, data);
      fetchAds(); // Обновляем список
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  };

  // Проверяем, является ли текущий пользователь владельцем объявления
  const checkIsOwner = (ad: any) => {
    const currentUser = getCurrentUser();
    return currentUser && ad.userId === currentUser.id;
  };

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
        title="Trade"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Trade' },
        ]}
      />

      <Container
        sx={{
          maxWidth: '1280px !important',
          py: { xs: 4, sm: 6, md: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TradeFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onCreateAd={handleCreateAd}
        />

        <TradeAdList
          ads={ads}
          loading={loading}
          isOwner={checkIsOwner}
          onDeleteAd={handleDeleteAd}
          onUpdateAd={handleUpdateAd}
        />

        {pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Trade;