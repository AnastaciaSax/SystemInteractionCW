// client/src/components/ui/Notification.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  type: NotificationType;
  duration?: number; // в миллисекундах, 0 = не закрывать автоматически
  onClose?: () => void;
  open: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  duration = 5000,
  onClose,
  open,
}) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
    
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Ждем завершения анимации
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgcolor: 'rgba(76, 175, 80, 0.95)',
          borderColor: '#4CAF50',
          icon: <CheckCircleIcon sx={{ color: 'white' }} />,
        };
      case 'error':
        return {
          bgcolor: 'rgba(244, 67, 54, 0.95)',
          borderColor: '#F44336',
          icon: <ErrorIcon sx={{ color: 'white' }} />,
        };
      case 'warning':
        return {
          bgcolor: 'rgba(255, 152, 0, 0.95)',
          borderColor: '#FF9800',
          icon: <ErrorIcon sx={{ color: 'white' }} />,
        };
      case 'info':
      default:
        return {
          bgcolor: 'rgba(240, 94, 186, 0.95)', // F05EBA с прозрачностью
          borderColor: '#F05EBA',
          icon: <InfoIcon sx={{ color: 'white' }} />,
        };
    }
  };

  const styles = getStyles();

  return (
    <Collapse in={isVisible}>
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          minWidth: 300,
          maxWidth: 400,
          backgroundColor: styles.bgcolor,
          backdropFilter: 'blur(10px)',
          border: `2px solid ${styles.borderColor}`,
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          animation: open ? 'slideIn 0.5s ease-out' : 'slideOut 0.5s ease-in',
          '@keyframes slideIn': {
            '0%': {
              transform: 'translateX(100%)',
              opacity: 0,
            },
            '100%': {
              transform: 'translateX(0)',
              opacity: 1,
            },
          },
          '@keyframes slideOut': {
            '0%': {
              transform: 'translateX(0)',
              opacity: 1,
            },
            '100%': {
              transform: 'translateX(100%)',
              opacity: 0,
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            gap: 2,
          }}
        >
          {/* Иконка */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          >
            {styles.icon}
          </Box>

          {/* Текст */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: 'white',
                fontFamily: '"McLaren", cursive',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.3,
              }}
            >
              {message}
            </Typography>
          </Box>

          {/* Кнопка закрытия */}
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Прогресс бар (только если есть duration) */}
        {duration > 0 && (
          <Box
            sx={{
              height: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                backgroundColor: 'white',
                animation: `progress ${duration}ms linear`,
                '@keyframes progress': {
                  '0%': { width: '100%' },
                  '100%': { width: '0%' },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default Notification;