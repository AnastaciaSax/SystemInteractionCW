import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Pagination from '../../../components/ui/Pagination';

interface FeedbackSectionProps {
  user: any;
  ratings: any[];
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ user, ratings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Рассчитываем реальный средний рейтинг из отзывов
  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + (rating.score || 0), 0);
    return sum / ratings.length;
  };
  
  const averageRating = calculateAverageRating();
  
  // Разбиваем на страницы
  const totalPages = Math.ceil(ratings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRatings = ratings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Функция для отображения звезд рейтинга
  const renderStars = (rating: number) => {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          star <= Math.round(rating) ? (
            <StarIcon key={star} sx={{ color: '#EC2EA6', fontSize: 20 }} />
          ) : (
            <StarBorderIcon key={star} sx={{ color: '#EC2EA6', fontSize: 20 }} />
          )
        ))}
      </Box>
    );
  };

  // Функция для отображения пустых звезд (когда рейтинг 0)
  const renderEmptyStars = () => {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarBorderIcon key={star} sx={{ color: '#EC2EA6', fontSize: 20, opacity: 0.3 }} />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 8, width: '100%' }}>
      {/* Заголовок с символом */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'left',
          color: 'var(--title, #560D30)',
          fontSize: { xs: '28px', md: '36px' },
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          mb: 4,
        }}
      >
        FeedBack 💬
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' }, 
        gap: { xs: 4, lg: '156px' },
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        {/* Общий рейтинг - слева */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: { xs: '100%', lg: 'auto' },
            order: { xs: 2, lg: 1 },
            flexShrink: 0, // Предотвращает сжатие
          }}
        >
          {/* Контейнер для звездочки и рейтинга, который предотвращает перенос */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap', // Запрещаем перенос текста
              flexWrap: 'nowrap',
              mb: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                color: 'var(--checked, #EC2EA6)',
                fontSize: { xs: '48px', md: '64px' },
                fontFamily: '"Nobile", sans-serif',
                fontWeight: 400,
                lineHeight: 1, // Устанавливаем фиксированную высоту строки
              }}
            >
              ★ {averageRating.toFixed(1)}
            </Typography>
          </Box>
          
          <Typography
            sx={{
              color: '#852654',
              fontSize: '16px',
              fontFamily: '"Nobile", sans-serif',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            Based on {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
          </Typography>
          
          {/* Отображение звезд общего рейтинга */}
          <Box sx={{ mt: 2 }}>
            {averageRating > 0 ? renderStars(averageRating) : renderEmptyStars()}
          </Box>
        </Box>

        {/* Карточки с отзывами - справа */}
        <Box sx={{ 
          flex: 1, 
          width: '100%',
          order: { xs: 1, lg: 2 },
        }}>
          {displayedRatings.length > 0 ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: '20px',
                  mb: 4,
                }}
              >
                {displayedRatings.map((rating) => (
                  <Box
                    key={rating.id}
                    sx={{
                      width: { xs: '100%', md: '305px' },
                      maxWidth: '100%',
                      padding: '20px',
                      background: 'rgba(153, 242, 247, 0.39)',
                      borderRadius: '40px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 20px rgba(236, 46, 166, 0.15)',
                      },
                    }}
                  >
                    {/* Заголовок карточки */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={rating.rater?.profile?.avatar || '/assets/default-avatar.png'}
                        alt={rating.rater?.username}
                        style={{
                          width: 86,
                          height: 86,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            color: '#82164A',
                            fontSize: '20px',
                            fontFamily: '"Nobile", sans-serif',
                            fontWeight: 700,
                            lineHeight: '30px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {rating.rater?.username}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#82164A',
                            fontSize: '16px',
                            fontFamily: '"Nobile", sans-serif',
                            fontStyle: 'italic',
                            fontWeight: 400,
                            lineHeight: '30px',
                          }}
                        >
                          {rating.rater?.region || 'Unknown region'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Рейтинг - звезды в отзывах */}
                    <Box>
                      {renderStars(rating.score)}
                    </Box>

                    {/* Комментарий */}
                    <Typography
                      sx={{
                        color: '#804A64',
                        fontSize: '16px',
                        fontFamily: '"Nobile", sans-serif',
                        fontWeight: 400,
                        lineHeight: 1.6,
                      }}
                    >
                      "{rating.comment || 'No comment provided'}"
                    </Typography>

                    {/* Ссылка на объявление */}
                    {rating.trade && (
                      <Typography
                        sx={{
                          color: '#EC2EA6',
                          fontSize: '12px',
                          fontFamily: '"Nobile", sans-serif',
                          fontStyle: 'italic',
                          mt: 1,
                        }}
                      >
                        Trade: {rating.trade.title}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Пагинация с использованием готового компонента */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    variant="numbers"
                    color="custom"
                    size="medium"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography
                sx={{
                  color: '#852654',
                  fontSize: '18px',
                  fontFamily: '"Nobile", sans-serif',
                  fontStyle: 'italic',
                }}
              >
                No feedback yet. Be the first to trade with {user?.username}! 🤝
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackSection;