import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import SearchInput from '../../components/ui/SearchInput';
import CategorySection from './components/CategorySection';
import ArticleModal from './components/ArticleModal';
import Notification, { NotificationType } from '../../components/ui/Notification';
import { articlesAPI } from '../../services/api';
import { Article } from '../../services/types';

const Guide: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: NotificationType;
  }>({
    open: false,
    message: '',
    type: 'info',
  });

  // Load articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Listen for like events
  useEffect(() => {
    const handleArticleLiked = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { liked, articleTitle } = customEvent.detail;
      
      setNotification({
        open: true,
        message: liked 
          ? `You liked "${articleTitle}"` 
          : `You removed like from "${articleTitle}"`,
        type: liked ? 'success' : 'info',
      });
    };

    window.addEventListener('articleLiked', handleArticleLiked);
    return () => window.removeEventListener('articleLiked', handleArticleLiked);
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, we would use: const response = await articlesAPI.getAll();
      // For now, let's simulate API call with setTimeout
      setTimeout(() => {
        // Mock data based on your database
        const mockArticles: Article[] = [
          {
            id: 'art_001',
            title: 'How To Clean a Pet?',
            content: 'Complete guide to cleaning LPS figures without damaging them. Use mild soap and soft brush...',
            category: 'CARE_STORAGE',
            authorId: 'admin_001',
            imageUrl: '/assets/article1.png',
            tags: ['dirtylps', 'clean', 'tlc', 'revive'],
            published: true,
            views: 156,
            createdAt: new Date().toISOString(),
          },
          // Add more mock articles based on your database
          // For demonstration, I'll add a few more
          {
            id: 'art_002',
            title: 'How To Store: Shelf or Box?',
            content: 'Pros and cons of different storage methods for LPS collections...',
            category: 'CARE_STORAGE',
            authorId: 'admin_001',
            imageUrl: '/assets/article2.png',
            tags: ['storage', 'display', 'collection'],
            published: true,
            views: 89,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'art_004',
            title: 'LPS Evolution: 90\'s - today',
            content: 'History of Littlest Pet Shop from the beginning to modern releases...',
            category: 'HISTORY_NEWS',
            authorId: 'admin_001',
            imageUrl: '/assets/article4.png',
            tags: ['evolution', 'history', 'brand'],
            published: true,
            views: 342,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'art_007',
            title: 'Authenticity: Not To Get Bamboozled',
            content: 'How to spot fake LPS figures and ensure authenticity...',
            category: 'RULES_POLITICS',
            authorId: 'admin_001',
            imageUrl: '/assets/article7.png',
            tags: ['comparison', 'fake', 'authentic'],
            published: true,
            views: 267,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'art_009',
            title: 'How To Grow the Collection?',
            content: 'Beginner\'s guide to starting and expanding an LPS collection...',
            category: 'ADVICE_BEGINNERS',
            authorId: 'user_003',
            imageUrl: '/assets/article9.png',
            tags: ['collect', 'grow', 'start', 'advice'],
            published: true,
            views: 189,
            createdAt: new Date().toISOString(),
          },
        ];
        
        setArticles(mockArticles);
        setFilteredArticles(mockArticles);
        setIsLoading(false);
      }, 1000);
      
      // In production, use this:
      // const response = await articlesAPI.getAll();
      // setArticles(response.data);
      // setFilteredArticles(response.data);
      
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredArticles(articles);
      return;
    }
    
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      article.content.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredArticles(filtered);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const groupArticlesByCategory = () => {
    const categories = [
      { key: 'CARE_STORAGE', label: 'Care & Storage' },
      { key: 'HISTORY_NEWS', label: 'History & News' },
      { key: 'RULES_POLITICS', label: 'Our Rules & Politics' },
      { key: 'ADVICE_BEGINNERS', label: 'Advice For Dummies' },
    ];

    return categories.map(category => ({
      ...category,
      articles: filteredArticles.filter(article => article.category === category.key)
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilteredArticles(articles);
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      
      {/* Page Banner */}
      <PageBanner
        title="Guide"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Guide' },
        ]}
        imageUrl="/assets/banner-guide.png"
      />

      {/* Main Content */}
      <Container
        sx={{
          maxWidth: '1280px !important',
          py: { xs: 4, md: 6 },
          flex: 1,
        }}
      >
        {/* Search Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: { xs: 4, md: 6 },
            gap: 2,
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '300px', md: '400px' } }}>
            <SearchInput
              placeholder="Search articles, tags..."
              value={searchQuery}
              onChange={handleSearch}
              onClear={clearFilters}
            />
          </Box>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#F056B7' }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* No Results */}
        {!isLoading && filteredArticles.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '15px',
            }}
          >
            <Typography
              variant="h5"
              sx={{ 
                color: '#560D30', 
                fontFamily: '"McLaren", cursive',
                mb: 2,
              }}
            >
              No articles found
            </Typography>
            <Typography sx={{ color: '#852654', fontFamily: '"Nobile", sans-serif' }}>
              Try a different search term or check back later for new articles.
            </Typography>
          </Box>
        )}

        {/* Articles by Category */}
        {!isLoading && filteredArticles.length > 0 && (
          <Box>
            {groupArticlesByCategory().map((category) => (
              <CategorySection
                key={category.key}
                title={category.label}
                articles={category.articles}
                onArticleClick={handleArticleClick}
              />
            ))}
          </Box>
        )}

        {/* Stats */}
        {!isLoading && filteredArticles.length > 0 && (
          <Box
            sx={{
              mt: 6,
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '15px',
              border: '2px solid #F6C4D4',
            }}
          >
            <Typography
              sx={{
                color: '#560D30',
                fontFamily: '"Nobile", sans-serif',
                textAlign: 'center',
              }}
            >
              Showing {filteredArticles.length} of {articles.length} articles
              {searchQuery && ` for "${searchQuery}"`}
            </Typography>
          </Box>
        )}
      </Container>

      <Footer />

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        open={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        duration={3000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default Guide;