// client/src/components/ui/Modal/Modal.tsx
import React, { useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Backdrop,
  Fade 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  padding?: number;
  blurBackground?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullWidth = false,
  showCloseButton = true,
  disableBackdropClick = false,
  padding = 4,
  blurBackground = true,
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'xs': return 400;
      case 'sm': return 600;
      case 'lg': return 900;
      case 'xl': return 1200;
      case 'md':
      default: return 800;
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (!disableBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Backdrop
      open={open}
      onClick={handleBackdropClick}
      sx={{
        zIndex: 1300,
        backdropFilter: blurBackground ? 'blur(4px)' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            width: fullWidth ? '95%' : getMaxWidth(),
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            m: 2,
          }}
        >
          {/* Header */}
          {title && (
            <Box
              sx={{
                p: 3,
                borderBottom: '1px solid rgba(236, 46, 166, 0.2)',
                backgroundColor: 'rgba(86, 13, 48, 0.05)',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"McLaren", cursive',
                  color: '#560D30',
                  textTransform: 'capitalize',
                }}
              >
                {title}
              </Typography>
              
              {showCloseButton && (
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: '#560D30',
                    '&:hover': {
                      backgroundColor: 'rgba(86, 13, 48, 0.1)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          )}

          {/* Content */}
          <Box sx={{ p: padding }}>
            {children}
          </Box>
        </Box>
      </Fade>
    </Backdrop>
  );
};

export default Modal;