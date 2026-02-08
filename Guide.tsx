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

  // Load articles from database
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
          ? `❤️ You liked "${articleTitle}"` 
          : `💔 You removed like from "${articleTitle}"`,
        type: liked ? 'success' : 'info',
      });
    };

    window.addEventListener('articleLiked', handleArticleLiked);
    return () => window.removeEventListener('articleLiked', handleArticleLiked);
  }, []);

  // Fetch articles from real database
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Real API call to your backend
      const response = await articlesAPI.getAll();
      const articlesData = response.data;
      
      setArticles(articlesData);
      setFilteredArticles(articlesData);
      setIsLoading(false);
      
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
      setIsLoading(false);
      
      // Fallback to sample data if API fails
      const sampleArticles: Article[] = [
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
          id: 'art_003',
          title: 'LPS Revamp: do\'s & dont\'s',
          content: 'Guide to restoring damaged figures while maintaining their value...',
          category: 'CARE_STORAGE',
          authorId: 'user_003',
          imageUrl: '/assets/article3.png',
          tags: ['fix', 'revamp', 'restoration'],
          published: true,
          views: 203,
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
          id: 'art_005',
          title: 'BasicFun In Charge?',
          content: 'Latest news about BasicFun taking over LPS production...',
          category: 'HISTORY_NEWS',
          authorId: 'admin_001',
          imageUrl: '/assets/article5.png',
          tags: ['nova', 'twist', 'comeback'],
          published: true,
          views: 178,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'art_006',
          title: '2025: TOP Rarest Pets',
          content: 'Preview of the rarest LPS figures coming in 2025...',
          category: 'HISTORY_NEWS',
          authorId: 'admin_001',
          imageUrl: '/assets/article6.png',
          tags: ['news', 'rare', '2025', 'top'],
          published: true,
          views: 415,
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
          id: 'art_008',
          title: 'Society Rules: Secure Trading',
          content: 'Community guidelines for safe and fair trading...',
          category: 'RULES_POLITICS',
          authorId: 'admin_001',
          imageUrl: '/assets/article8.png',
          tags: ['rules', 'trade', 'security', 'kids'],
          published: true,
          views: 134,
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
      
      setArticles(sampleArticles);
      setFilteredArticles(sampleArticles);
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

  const handleArticleClick = async (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    
    // Increment views in database when article is opened
    try {
      // This would be a real API call to increment views
      // await articlesAPI.incrementViews(article.id);
      
      // Update local state to reflect view increment
      setArticles(prev => prev.map(a => 
        a.id === article.id ? { ...a, views: a.views + 1 } : a
      ));
      setFilteredArticles(prev => prev.map(a => 
        a.id === article.id ? { ...a, views: a.views + 1 } : a
      ));
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
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
    
    // Clear search from localStorage
    localStorage.removeItem('guideSearchQuery');
  };

  // Save search query to localStorage
  useEffect(() => {
    if (searchQuery.trim()) {
      localStorage.setItem('guideSearchQuery', searchQuery);
    }
  }, [searchQuery]);

  // Load search query from localStorage on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem('guideSearchQuery');
    if (savedQuery) {
      setSearchQuery(savedQuery);
      handleSearch(savedQuery);
    }
  }, [articles]);

  const categories = groupArticlesByCategory();

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

        {/* Loading State - Full page skeleton */}
        {isLoading && articles.length === 0 ? (
          <Box>
            {categories.map((category, index) => (
              <CategorySection
                key={category.key}
                title={category.label}
                articles={[]}
                onArticleClick={handleArticleClick}
                isLoading={true}
              />
            ))}
          </Box>
        ) : (
          <>
            {/* No Results */}
            {filteredArticles.length === 0 && searchQuery && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '15px',
                  mb: 6,
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
                  No articles found for "{searchQuery}"
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#852654', 
                    fontFamily: '"Nobile", sans-serif',
                    mb: 3,
                  }}
                >
                  Try a different search term or check back later for new articles.
                </Typography>
                <Box
                  onClick={clearFilters}
                  sx={{
                    display: 'inline-block',
                    backgroundColor: '#F056B7',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontFamily: '"Nobile", sans-serif',
                    '&:hover': {
                      backgroundColor: '#EC2EA6',
                    },
                  }}
                >
                  Clear Search
                </Box>
              </Box>
            )}

            {/* Articles by Category */}
            {categories.map((category) => (
              category.articles.length > 0 && (
                <CategorySection
                  key={category.key}
                  title={category.label}
                  articles={category.articles}
                  onArticleClick={handleArticleClick}
                />
              )
            ))}

            {/* Stats */}
            {filteredArticles.length > 0 && (
              <Box
                sx={{
                  mt: 6,
                  p: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '15px',
                  border: '2px solid #F6C4D4',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: '#560D30',
                    fontFamily: '"Nobile", sans-serif',
                  }}
                >
                  Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                  {!searchQuery && ` • Total views: ${filteredArticles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}`}
                </Typography>
              </Box>
            )}
          </>
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