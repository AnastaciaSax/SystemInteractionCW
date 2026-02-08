/// client/src/pages/Guide/components/ArticleCard.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Skeleton,
} from '@mui/material';
import { Article } from '../../../services/types';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Форматируем теги как в макете
  const formatTags = (tags: string[]) => {
    return tags.map(tag => `#${tag}`).join(' ');
  };

  if (isLoading) {
    return <ArticleCardSkeleton />;
  }

  return (
    <Box
      onClick={() => onClick(article)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '5px',
        width: '100%',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          '& .article-image': {
            transform: 'scale(1.02)',
          },
        },
      }}
    >
      {/* Изображение статьи */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '200px', sm: '250px', md: '310px' },
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#F6C4D4',
        }}
      >
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ bgcolor: '#F6C4D4' }}
          />
        )}
        <Box
          component="img"
          src={article.imageUrl || '/assets/article-placeholder.png'}
          alt={article.title}
          className="article-image"
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '10px',
            transition: 'transform 0.3s ease',
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      </Box>

      {/* Заголовок статьи */}
      <Typography
        sx={{
          color: '#560D30',
          fontSize: '18px',
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          lineHeight: 1.3,
          mt: 0.5,
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {article.title}
      </Typography>

      {/* Теги */}
      <Typography
        sx={{
          color: '#852654',
          fontSize: '15px',
          fontFamily: '"Nobile", sans-serif',
          fontWeight: 400,
          lineHeight: 1.4,
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {formatTags(article.tags.slice(0, 3))}
        {article.tags.length > 3 && ' ...'}
      </Typography>
    </Box>
  );
};

// Скелетон для загрузки
export const ArticleCardSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        width: '100%',
      }}
    >
      {/* Скелетон изображения */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={310}
        sx={{ 
          borderRadius: '10px',
          bgcolor: '#F6C4D4',
        }}
      />
      
      {/* Скелетон заголовка */}
      <Skeleton
        variant="text"
        width="90%"
        height={24}
        sx={{ bgcolor: '#F6C4D4' }}
      />
      
      {/* Скелетон тегов */}
      <Skeleton
        variant="text"
        width="70%"
        height={20}
        sx={{ bgcolor: '#F6C4D4' }}
      />
    </Box>
  );
};

export default ArticleCard;