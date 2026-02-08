import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Divider,
  Skeleton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';
import { Article } from '../../../services/types';

interface ArticleModalProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, open, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [articleData, setArticleData] = useState<Article | null>(article);
  const [viewsIncremented, setViewsIncremented] = useState(false);

  useEffect(() => {
    if (article && open) {
      setArticleData(article);
      
      // Check like in localStorage
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      setIsLiked(!!likedArticles[article.id]);
      
      // Increment views only once per session
      if (!viewsIncremented) {
        // In a real app, this would be an API call
        // For now, we'll just update the local state
        setArticleData(prev => prev ? { ...prev, views: prev.views + 1 } : null);
        setViewsIncremented(true);
      }
    }
  }, [article, open, viewsIncremented]);

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
    
    // Show notification
    const event = new CustomEvent('articleLiked', { 
      detail: { 
        liked: newIsLiked,
        articleTitle: articleData.title 
      } 
    });
    window.dispatchEvent(event);
  };

  const handleShare = () => {
    if (!articleData) return;
    
    if (navigator.share) {
      navigator.share({
        title: articleData.title,
        text: articleData.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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
            }}
          />
          
          {/* Gradient overlay and buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(86, 13, 48, 0.3) 0%, rgba(86, 13, 48, 0.7) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
            }}
          >
            {/* Top buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  px: 2,
                  py: 0.5,
                  borderRadius: '20px',
                }}
              >
                <Typography
                  sx={{
                    color: '#560D30',
                    fontFamily: '"McLaren", cursive',
                    fontSize: '14px',
                  }}
                >
                  {getCategoryLabel(articleData.category)}
                </Typography>
              </Box>
              
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

            {/* Title */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Rammetto One", cursive',
                  color: 'white',
                  fontSize: { xs: '24px', sm: '32px', md: '40px' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  mb: 2,
                }}
              >
                {articleData.title}
              </Typography>
              
              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {articleData.tags.map((tag, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '15px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#560D30',
                        fontFamily: '"Nobile", sans-serif',
                        fontSize: '12px',
                      }}
                    >
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Контент модалки */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 3, sm: 4 } }}>
          {/* Article info */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
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

          {/* Article content */}
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

          {/* Read time estimate */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #F6C4D4' }}>
            <Typography
              sx={{
                color: '#852654',
                fontFamily: '"Nobile", sans-serif',
                fontStyle: 'italic',
                fontSize: '14px',
              }}
            >
              Read time: {Math.ceil(articleData.content.split(' ').length / 200)} minutes
              {' • '}
              {articleData.content.split(' ').length} words
            </Typography>
          </Box>
        </Box>

        {/* Footer with action buttons */}
        <Box
          sx={{
            p: 3,
            backgroundColor: '#F8FFFF',
            borderTop: '2px solid #F6C4D4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Left side */}
          <Box sx={{ display: 'flex', gap: 2 }}>
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
            </IconButton>
            
            <IconButton
              onClick={handleShare}
              sx={{
                backgroundColor: 'white',
                color: '#560D30',
                border: '2px solid #F056B7',
                '&:hover': {
                  backgroundColor: '#F8FFFF',
                },
              }}
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ArticleModal;