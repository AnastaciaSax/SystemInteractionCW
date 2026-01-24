// client/src/components/ui/PhotoUploadLoader.tsx
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

interface PhotoUploadLoaderProps {
  progress?: number; // от 0 до 100
  message?: string;
  variant?: 'circle' | 'wave' | 'dots';
}

const PhotoUploadLoader: React.FC<PhotoUploadLoaderProps> = ({
  progress = 0,
  message = 'Uploading...',
  variant = 'circle',
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'wave':
        return (
          <Box sx={{ position: 'relative', width: 80, height: 80 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: i * 16,
                  width: 12,
                  height: 40,
                  backgroundColor: '#F05EBA',
                  borderRadius: '6px',
                  animation: `wave 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  '@keyframes wave': {
                    '0%, 40%, 100%': {
                      height: 20,
                    },
                    '20%': {
                      height: 40,
                    },
                  },
                }}
              />
            ))}
          </Box>
        );

      case 'dots':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: '#F05EBA',
                  borderRadius: '50%',
                  animation: `bounce 1.4s infinite ease-in-out`,
                  animationDelay: `${i * 0.16}s`,
                  '@keyframes bounce': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0.8)',
                      opacity: 0.5,
                    },
                    '40%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                  },
                }}
              />
            ))}
          </Box>
        );

      case 'circle':
      default:
        return (
          <Box sx={{ position: 'relative', width: 80, height: 80 }}>
            {/* Внешний круг */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={4}
              sx={{
                color: 'rgba(240, 94, 186, 0.2)',
                position: 'absolute',
              }}
            />
            
            {/* Прогресс */}
            <CircularProgress
              variant={progress ? 'determinate' : 'indeterminate'}
              value={progress}
              size={80}
              thickness={4}
              sx={{
                color: '#F05EBA',
                position: 'relative',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            
            {/* Иконка в центре */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {progress > 0 && progress < 100 ? (
                <ImageIcon sx={{ color: '#F05EBA', fontSize: 24 }} />
              ) : (
                <CloudUploadIcon sx={{ color: '#F05EBA', fontSize: 24 }} />
              )}
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: 4,
        backgroundColor: 'rgba(255, 246, 249, 0.9)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(240, 94, 186, 0.2)',
        minWidth: 200,
        minHeight: 200,
      }}
    >
      {/* Анимированный загрузчик */}
      {renderLoader()}
      
      {/* Сообщение */}
      <Typography
        sx={{
          color: '#560D30',
          fontFamily: '"McLaren", cursive',
          fontSize: '18px',
          textAlign: 'center',
          mt: 2,
        }}
      >
        {message}
      </Typography>
      
      {/* Процент (если указан) */}
      {progress > 0 && (
        <Typography
          sx={{
            color: '#F05EBA',
            fontFamily: '"Nobile", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {Math.round(progress)}%
        </Typography>
      )}
      
      {/* Субтитры */}
      <Typography
        sx={{
          color: '#882253',
          fontFamily: '"Nobile", sans-serif',
          fontSize: '12px',
          textAlign: 'center',
          maxWidth: 200,
        }}
      >
        Please wait while we process your image...
      </Typography>
    </Box>
  );
};

export default PhotoUploadLoader;