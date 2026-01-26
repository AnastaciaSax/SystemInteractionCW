// client/src/pages/Wishlist/Wishlist.tsx
import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import WishlistFilters from './components/WishlistFilters';
import WishlistItemList from './components/WishlistItemList';
import Pagination from './components/Pagination';
import Notification from '../../components/ui/Notification';
import { wishlistAPI, figurinesAPI } from '../../services/api';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const [figurines, setFigurines] = useState<any[]>([]);
  const [myWishlist, setMyWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    type: 'info',
  });

  const [filters, setFilters] = useState({
    search: '',
    yearRange: 'ALL',
    rarity: 'ALL',
    mold: 'ALL',
    view: 'ALL',
    sort: 'newest'
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 6
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  // Получить текущего пользователя
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  // Проверка, находится ли фигурка в вишлисте пользователя
  const isInMyWishlist = (figurineId: string) => {
    return myWishlist.some(item => item.figurineId === figurineId);
  };

  // Получить заметку для фигурки из вишлиста
  const getWishlistNote = (figurineId: string) => {
    const item = myWishlist.find(item => item.figurineId === figurineId);
    return item ? item.note : '';
  };

  // Получить ID элемента вишлиста
  const getWishlistItemId = (figurineId: string) => {
    const item = myWishlist.find(item => item.figurineId === figurineId);
    return item ? item.id : null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let figurinesData: any[] = [];
      
      if (filters.view === 'MINE') {
        // Загружаем только фигурки из вишлиста пользователя
        const wishlistResponse = await wishlistAPI.getMyWishlist();
        const wishlistItems = wishlistResponse.data || [];
        setMyWishlist(wishlistItems);
        
        // Получаем детали каждой фигурки
        const figurinePromises = wishlistItems.map(async (item: any) => {
          try {
            const response = await figurinesAPI.getById(item.figurineId);
            return { ...response.data, wishlistItem: item };
          } catch (error) {
            console.error(`Error fetching figurine ${item.figurineId}:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(figurinePromises);
        figurinesData = results.filter(Boolean);
        
        // Применяем фильтры к данным вишлиста
        figurinesData = applyFilters(figurinesData);
        figurinesData = sortFigurines(figurinesData, filters.sort);
        
        setFigurines(figurinesData);
        setPagination(prev => ({ 
          ...prev, 
          total: figurinesData.length, 
          pages: Math.ceil(figurinesData.length / prev.limit)
        }));
      } else {
        // Загружаем все фигурки
        const figurinesResponse = await figurinesAPI.getAll({
          search: filters.search || undefined,
          rarity: filters.rarity !== 'ALL' ? filters.rarity : undefined,
          series: filters.yearRange !== 'ALL' ? getSeriesFromYearRange(filters.yearRange) : undefined
        });
        
        figurinesData = figurinesResponse.data || [];
        
        // Загружаем вишлист пользователя для отображения статуса
        try {
          const wishlistResponse = await wishlistAPI.getMyWishlist();
          setMyWishlist(wishlistResponse.data || []);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          setMyWishlist([]);
        }
        
        // Применяем фильтры
        figurinesData = applyFilters(figurinesData);
        figurinesData = sortFigurines(figurinesData, filters.sort);
        
        // Пагинация
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = figurinesData.slice(startIndex, endIndex);
        
        setFigurines(paginatedData);
        setPagination(prev => ({
          ...prev,
          total: figurinesData.length,
          pages: Math.ceil(figurinesData.length / prev.limit)
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFigurines([]);
      setMyWishlist([]);
      showNotification('Failed to load wishlist data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Функция применения фильтров
  const applyFilters = (data: any[]) => {
    let filtered = [...data];
    
    // Фильтр по году (yearRange)
    if (filters.yearRange !== 'ALL') {
      const [startYear, endYear] = getYearsFromRange(filters.yearRange);
      filtered = filtered.filter(figurine => 
        figurine.year >= startYear && figurine.year <= endYear
      );
    }
    
    // Фильтр по редкости
    if (filters.rarity !== 'ALL') {
      filtered = filtered.filter(figurine => figurine.rarity === filters.rarity);
    }
    
    // Фильтр по форме
    if (filters.mold !== 'ALL') {
      filtered = filtered.filter(figurine => figurine.mold === filters.mold);
    }
    
    return filtered;
  };

  // Функция сортировки
  const sortFigurines = (data: any[], sortType: string) => {
    const sorted = [...data];
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year);
      case 'oldest':
        return sorted.sort((a, b) => a.year - b.year);
      case 'rarity':
        // Сортируем по редкости: EXCLUSIVE > RARE > UNCOMMON > COMMON
        const rarityOrder = { EXCLUSIVE: 4, RARE: 3, UNCOMMON: 2, COMMON: 1 };
        return sorted.sort((a, b) => 
          (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - 
          (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0)
        );
      case 'number':
        return sorted.sort((a, b) => a.number.localeCompare(b.number));
      default:
        return sorted;
    }
  };

  // Преобразование диапазона лет в годы
  const getYearsFromRange = (range: string): [number, number] => {
    switch (range) {
      case '2005-2008': return [2005, 2008];
      case '2009-2013': return [2009, 2013];
      case '2014-2017': return [2014, 2017];
      case '2018-2022': return [2018, 2022];
      case '2023-2025': return [2023, 2025];
      default: return [2000, 2025];
    }
  };

  // Преобразование диапазона лет в серии
  const getSeriesFromYearRange = (range: string): string => {
    switch (range) {
      case '2005-2008': return 'G2';
      case '2009-2013': return 'G3';
      case '2014-2017': return 'G4';
      case '2018-2022': return 'G6';
      case '2023-2025': return 'G7';
      default: return '';
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination.page]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleAddToWishlist = async (figurineId: string, note?: string) => {
    try {
      const response = await wishlistAPI.addToWishlist({
        figurineId,
        note,
        priority: 1
      });
      
      if (response.data) {
        // Обновляем локальное состояние
        setMyWishlist(prev => [...prev, response.data]);
        showNotification('Added to wishlist successfully! 💖', 'success');
        return Promise.resolve(response.data);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showNotification('Failed to add to wishlist', 'error');
      return Promise.reject(error);
    }
  };

  const handleUpdateNote = async (wishlistItemId: string, note: string) => {
    try {
      await wishlistAPI.updateWishlistItem(wishlistItemId, { note });
      
      // Обновляем локальное состояние
      setMyWishlist(prev => 
        prev.map(item => 
          item.id === wishlistItemId ? { ...item, note } : item
        )
      );
      
      showNotification('Note updated successfully! 📝', 'success');
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating note:', error);
      showNotification('Failed to update note', 'error');
      return Promise.reject(error);
    }
  };

  const handleRemoveFromWishlist = async (wishlistItemId: string) => {
    try {
      await wishlistAPI.removeFromWishlist(wishlistItemId);
      
      // Обновляем локальное состояние
      setMyWishlist(prev => prev.filter(item => item.id !== wishlistItemId));
      
      // Если в режиме "MINE", обновляем список фигурок
      if (filters.view === 'MINE') {
        fetchData();
      }
      
      showNotification('Removed from wishlist', 'info');
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showNotification('Failed to remove from wishlist', 'error');
      return Promise.reject(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Header />

      {/* Уведомление */}
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        duration={3000}
      />

      <PageBanner
        title="Wishlist"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Wishlist' },
        ]}
        imageUrl="/assets/banner-wishlist.png"
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
        <WishlistFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <WishlistItemList
          figurines={figurines}
          loading={loading}
          isInMyWishlist={isInMyWishlist}
          getWishlistNote={getWishlistNote}
          getWishlistItemId={getWishlistItemId}
          onAddToWishlist={handleAddToWishlist}
          onUpdateNote={handleUpdateNote}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onSuccess={(message) => showNotification(message, 'success')}
          onError={(message) => showNotification(message, 'error')}
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

export default Wishlist;