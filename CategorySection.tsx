/// client/src/pages/Guide/components/CategorySection.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Article } from '../../../services/types';
import ArticleCard, { ArticleCardSkeleton } from './ArticleCard';
import SectionPagination from './SectionPagination';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  onArticleClick: (article: Article) => void;
  isLoading?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  articles,
  onArticleClick,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentPage, setCurrentPage] = useState(0);

  // Определяем количество карточек в зависимости от экрана
  const getItemsPerPage = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  
  const getCurrentArticles = () => {
    const start = currentPage * itemsPerPage;
    return articles.slice(start, start + itemsPerPage);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Если загрузка, показываем скелетоны
  if (isLoading) {
    return (
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"McLaren", cursive',
            color: '#560D30',
            fontSize: { xs: '20px', sm: '24px', md: '28px' },
            fontWeight: 400,
            mb: 4,
          }}
        >
          {title}
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {[1, 2, 3].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ArticleCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (articles.length === 0) return null;

  return (
    <Box sx={{ mb: { xs: 6, md: 8 } }}>
      {/* Заголовок категории */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 3, md: 4 },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"McLaren", cursive',
            color: '#560D30',
            fontSize: { xs: '20px', sm: '24px', md: '28px' },
            fontWeight: 400,
          }}
        >
          {title}
        </Typography>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Кнопка назад */}
            <IconButton
              onClick={handlePrev}
              disabled={currentPage === 0}
              sx={{
                color: currentPage === 0 ? '#CCC' : '#560D30',
                '&:hover': {
                  backgroundColor: 'rgba(86, 13, 48, 0.1)',
                },
              }}
              size="small"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            {/* Пагинация точками */}
            <SectionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageClick={setCurrentPage}
            />

            {/* Кнопка вперед */}
            <IconButton
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              sx={{
                color: currentPage === totalPages - 1 ? '#CCC' : '#560D30',
                '&:hover': {
                  backgroundColor: 'rgba(86, 13, 48, 0.1)',
                },
              }}
              size="small"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Сетка статей */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {getCurrentArticles().map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <ArticleCard
              article={article}
              onClick={onArticleClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;