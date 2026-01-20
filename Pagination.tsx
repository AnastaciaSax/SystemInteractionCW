// client/src/components/ui/Pagination/Pagination.tsx
import React from 'react';
import { Box, IconButton, Button, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNumbers?: boolean;
  variant?: 'numbers' | 'dots' | 'minimal';
  color?: 'primary' | 'secondary' | 'custom';
  size?: 'small' | 'medium' | 'large';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showNumbers = true,
  variant = 'numbers',
  color = 'primary',
  size = 'medium',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: '14px' };
      case 'large':
        return { width: 60, height: 60, fontSize: '24px' };
      default:
        return { width: 50, height: 50, fontSize: '20px' };
    }
  };

  const getColor = () => {
    switch (color) {
      case 'secondary':
        return { bg: '#EC2EA6', hover: '#F056B7', text: 'white' };
      case 'custom':
        return { bg: '#F05EBA', hover: '#F056B7', text: 'white' };
      default:
        return { bg: '#560D30', hover: '#82164A', text: 'white' };
    }
  };

  const colors = getColor();
  const sizeStyles = getSizeStyles();

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (variant === 'minimal') {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{
            width: sizeStyles.width,
            height: sizeStyles.height,
            color: '#560D30',
            '&:hover': { backgroundColor: 'rgba(86, 13, 48, 0.1)' },
            '&:disabled': { opacity: 0.3 },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{
            width: sizeStyles.width,
            height: sizeStyles.height,
            color: '#560D30',
            '&:hover': { backgroundColor: 'rgba(86, 13, 48, 0.1)' },
            '&:disabled': { opacity: 0.3 },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    );
  }

  const visiblePages = getVisiblePages();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, marginTop: 5 }}>
      {/* Previous Button */}
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{
          ...sizeStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          border: '1px solid #F05EBA',
          color: '#560D30',
          '&:hover': {
            backgroundColor: 'rgba(240, 94, 186, 0.1)',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Page Numbers */}
      {showNumbers && visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...sizeStyles }}>
              <MoreHorizIcon sx={{ color: '#560D30' }} />
            </Box>
          ) : (
            <Button
              onClick={() => onPageChange(page as number)}
              sx={{
                ...sizeStyles,
                minWidth: sizeStyles.width,
                borderRadius: '50%',
                backgroundColor: currentPage === page ? colors.bg : 'rgba(255, 255, 255, 0.35)',
                color: currentPage === page ? colors.text : '#560D30',
                border: currentPage === page ? 'none' : '1px solid #F05EBA',
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: currentPage === page ? colors.hover : 'rgba(240, 94, 186, 0.1)',
                },
              }}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{
          ...sizeStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          border: '1px solid #F05EBA',
          color: '#560D30',
          '&:hover': {
            backgroundColor: 'rgba(240, 94, 186, 0.1)',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default Pagination;