import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface FeedbackSectionProps {
  user: any;
  ratings: any[];
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ user, ratings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Рассчитываем средний рейтинг
  const averageRating = user?.profile?.rating || 0;
  
  // Разбиваем на страницы
  const totalPages = Math.ceil(ratings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRatings = ratings.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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

  return (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          color: 'var(--title, #560D30)',
          fontSize: { xs: '28px', md: '36px' },
          fontFamily: '"McLaren", cursive',
          fontWeight: 400,
          mb: 4,
        }}
      >
        FeedBack
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Общий рейтинг */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: { xs: '100%', lg: '250px' },
          }}
        >
          <Typography
            sx={{
              color: 'var(--checked, #EC2EA6)',
              fontSize: { xs: '48px', md: '64px' },
              fontFamily: '"Nobile", sans-serif',
              fontWeight: 400,
            }}
          >
            ★ {averageRating.toFixed(1)}
          </Typography>
          <Typography
            sx={{
              color: '#852654',
              fontSize: '16px',
              fontFamily: '"Nobile", sans-serif',
              fontStyle: 'italic',
            }}
          >
            Based on {ratings.length} reviews
          </Typography>
          {renderStars(averageRating)}
        </Box>

        {/* Карточки с отзывами */}
        <Box sx={{ flex: 1 }}>
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
                  gap: 3,
                  mb: 4,
                }}
              >
                {displayedRatings.map((rating) => (
                  <Box
                    key={rating.id}
                    sx={{
                      padding: 3,
                      background: 'rgba(153, 242, 247, 0.39)',
                      borderRadius: '40px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {/* Заголовок карточки */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={rating.rater?.profile?.avatar || '/assets/default-avatar.png'}
                        alt={rating.rater?.username}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            color: '#82164A',
                            fontSize: '18px',
                            fontFamily: '"Nobile", sans-serif',
                            fontWeight: 700,
                          }}
                        >
                          {rating.rater?.username}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#82164A',
                            fontSize: '14px',
                            fontFamily: '"Nobile", sans-serif',
                            fontStyle: 'italic',
                          }}
                        >
                          {rating.rater?.region || 'Unknown region'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Рейтинг */}
                    <Box>
                      {renderStars(rating.score)}
                    </Box>

                    {/* Комментарий */}
                    <Typography
                      sx={{
                        color: '#804A64',
                        fontSize: '14px',
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

              {/* Пагинация */}
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <IconButton
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    sx={{
                      width: 50,
                      height: 50,
                      background: 'rgba(255, 255, 255, 0.35)',
                      borderRadius: '90px',
                      outline: '1px #F05EBA solid',
                      outlineOffset: '-1px',
                      '&:hover': {
                        backgroundColor: 'rgba(240, 94, 186, 0.1)',
                      },
                      '&:disabled': {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <ChevronLeftIcon sx={{ color: '#560D30' }} />
                  </IconButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Box
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      sx={{
                        width: 50,
                        height: 50,
                        background: currentPage === page ? '#F05EBA' : 'rgba(255, 255, 255, 0.35)',
                        borderRadius: '90px',
                        outline: currentPage === page ? 'none' : '1px #F05EBA solid',
                        outlineOffset: '-1px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: currentPage === page ? '#F05EBA' : 'rgba(240, 94, 186, 0.1)',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: currentPage === page ? 'white' : '#560D30',
                          fontSize: '20px',
                          fontFamily: '"McLaren", cursive',
                          fontWeight: 400,
                        }}
                      >
                        {page}
                      </Typography>
                    </Box>
                  ))}

                  <IconButton
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    sx={{
                      width: 50,
                      height: 50,
                      background: 'rgba(255, 255, 255, 0.35)',
                      borderRadius: '90px',
                      outline: '1px #F05EBA solid',
                      outlineOffset: '-1px',
                      '&:hover': {
                        backgroundColor: 'rgba(240, 94, 186, 0.1)',
                      },
                      '&:disabled': {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <ChevronRightIcon sx={{ color: '#560D30' }} />
                  </IconButton>
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