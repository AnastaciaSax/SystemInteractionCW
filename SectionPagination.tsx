import React from 'react';
import { Box, IconButton } from '@mui/material';

interface SectionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageClick: (page: number) => void;
}

const SectionPagination: React.FC<SectionPaginationProps> = ({
  currentPage,
  totalPages,
  onPageClick,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <IconButton
          key={index}
          onClick={() => onPageClick(index)}
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            padding: 0,
            position: 'relative',
            opacity: index === currentPage ? 1 : 0.5,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 0.8,
            },
          }}
          aria-label={`Go to page ${index + 1}`}
        >
          {/* Точка */}
          <Box
            sx={{
              width: { xs: 8, sm: 10 },
              height: { xs: 8, sm: 10 },
              borderRadius: '50%',
              backgroundColor: index === currentPage ? '#560D30' : '#560D30',
              transition: 'all 0.3s ease',
              transform: index === currentPage ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        </IconButton>
      ))}
    </Box>
  );
};

export default SectionPagination;