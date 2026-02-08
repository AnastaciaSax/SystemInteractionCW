import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { Article } from '../../../services/types';
import { articlesAPI } from '../../../services/api';

interface ArticleModalProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, open, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [articleData, setArticleData] = useState<Article | null>(article);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (article && open) {
      setArticleData(article);
      // Проверяем лайк в localStorage
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      setIsLiked(!!likedArticles[article.id]);
      
      // Загружаем полные данные статьи (для обновления просмотров)
      fetchArticleDetails(article.id);
    }
  }, [article, open]);

  const fetchArticleDetails = async (articleId: string) => {
    try {
      setIsLoading(true);
      // В реальном приложении здесь был бы запрос за полными данными
      // const response = await articlesAPI.getById(articleId);
      // setArticleData(response.data);
    } catch (error) {
      console.error('Error fetching article details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeClick = () => {
    if (!articleData) return;
    
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
    const newIsLiked = !isLiked;
    
    if (newIsLiked) {
      likedArticles[articleData.id] = true;
    } else {
      delete likedArticles[articleData.id];
    }
    
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
    setIsLiked(newIsLiked);
    
    // Показываем notification
    const event = new CustomEvent('articleLiked', { 
      detail: { 
        liked: newIsLiked,
        articleTitle: articleData.title 
      } 
    });
    window.dispatchEvent(event);
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'CARE_STORAGE': return 'Care & Storage';
      case 'HISTORY_NEWS': return 'History & News';
      case 'RULES_POLITICS': return 'Our Rules & Politics';
      case 'ADVICE_BEGINNERS': return 'Advice For Dummies';
      default: return category;
    }
  };

  if (!articleData) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="article-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '90%', md: '800px', lg: '900px' },
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header модалки */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '200px', sm: '250px', md: '300px' },
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={articleData.imageUrl || '/assets/article-placeholder.png'}
            alt={articleData.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.9)',
            }}
          />
          
          {/* Затемнение и кнопки */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
            }}
          >
            {/* Кнопка закрытия */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                onClick={onClose}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Заголовок статьи */}
            <Box>
              <Chip
                label={getCategoryLabel(articleData.category)}
                sx={{
                  backgroundColor: 'rgba(245, 0, 87, 0.9)',
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Rammetto One", cursive',
                  color: 'white',
                  fontSize: { xs: '24px', sm: '32px', md: '40px' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                {articleData.title}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Контент модалки */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 3, sm: 4 } }}>
          {/* Информация о статье */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 4,
              pb: 3,
              borderBottom: '2px solid #F6C4D4',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon sx={{ color: '#852654', fontSize: '20px' }} />
              <Typography sx={{ color: '#852654', fontFamily: '"Nobile", sans-serif' }}>
                {articleData.views} views
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ color: '#852654', fontSize: '20px' }} />
              <Typography sx={{ color: '#852654', fontFamily: '"Nobile", sans-serif' }}>
                {new Date(articleData.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#852654', fontSize: '20px' }} />
              <Typography sx={{ color: '#852654', fontFamily: '"Nobile", sans-serif' }}>
                Author ID: {articleData.authorId}
              </Typography>
            </Box>
          </Box>

          {/* Контент статьи */}
          {isLoading ? (
            <>
              <Skeleton variant="text" height={30} width="100%" sx={{ mb: 2 }} />
              <Skeleton variant="text" height={30} width="80%" sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
            </>
          ) : (
            <Typography
              sx={{
                color: '#560D30',
                fontFamily: '"Nobile", sans-serif',
                fontSize: '18px',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
              }}
            >
              {articleData.content}
            </Typography>
          )}

          {/* Теги */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #F6C4D4' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#560D30',
                fontFamily: '"McLaren", cursive',
                mb: 2,
              }}
            >
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {articleData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  sx={{
                    backgroundColor: 'rgba(133, 38, 84, 0.1)',
                    color: '#852654',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: 'rgba(133, 38, 84, 0.2)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Футер модалки */}
        <Box
          sx={{
            p: 3,
            backgroundColor: '#F8FFFF',
            borderTop: '2px solid #F6C4D4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#852654',
              fontFamily: '"Nobile", sans-serif',
              fontStyle: 'italic',
            }}
          >
            Read time: ~{Math.ceil(articleData.content.length / 1000)} min
          </Typography>
          
          <IconButton
            onClick={handleLikeClick}
            sx={{
              backgroundColor: isLiked ? '#F50057' : 'white',
              color: isLiked ? 'white' : '#560D30',
              border: `2px solid ${isLiked ? '#F50057' : '#F056B7'}`,
              '&:hover': {
                backgroundColor: isLiked ? '#D4004F' : '#F8FFFF',
              },
            }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <Typography sx={{ ml: 1, fontFamily: '"Nobile", sans-serif' }}>
              {isLiked ? 'Liked' : 'Like'}
            </Typography>
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ArticleModal;