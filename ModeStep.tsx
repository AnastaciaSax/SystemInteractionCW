import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ModeStepProps {
  onNext: (mode: 'SIMPLE' | 'ADMIN') => void;
  onBack: () => void;
  initialMode?: 'SIMPLE' | 'ADMIN';
}

const ModeStep: React.FC<ModeStepProps> = ({ onNext, onBack, initialMode = 'SIMPLE' }) => {
  const [mode, setMode] = useState<'SIMPLE' | 'ADMIN'>(initialMode);

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'SIMPLE' | 'ADMIN' | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleNext = () => {
    onNext(mode);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '844px',
        margin: '0 auto',
        padding: { xs: 3, sm: 4, md: 5 },
        background: 'rgba(255, 255, 255, 0.42)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
          fontFamily: '"McLaren", cursive',
          color: '#560D30',
          textAlign: 'center',
          mb: { xs: 3, sm: 4, md: 5 },
          textTransform: 'capitalize',
        }}
      >
        Pick User Mode
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          mb: 4,
        }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="user mode"
          sx={{
            width: { xs: '100%', sm: '542px' },
            height: '37px',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid #EC2EA6',
            overflow: 'hidden',
            '& .MuiToggleButton-root': {
              flex: 1,
              height: '100%',
              border: 'none',
              borderRadius: '10px',
              color: '#560D30',
              fontSize: { xs: '14px', sm: '16px', md: '20px' },
              fontFamily: '"Nobile", sans-serif',
              fontWeight: 400,
              textTransform: 'none',
              '&.Mui-selected': {
                backgroundColor: '#F05EBA',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#EC2EA6',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(240, 94, 186, 0.1)',
              },
            },
          }}
        >
          <ToggleButton value="SIMPLE" aria-label="simple mode">
            Simple
          </ToggleButton>
          <ToggleButton 
            value="ADMIN" 
            aria-label="admin mode"
            sx={{
              color: mode === 'ADMIN' ? '#560D30' : 'rgba(86, 13, 48, 0.8)',
              backgroundColor: mode === 'ADMIN' ? '#F05EBA' : 'rgba(240, 94, 186, 0.1)',
              '&.Mui-selected': {
                backgroundColor: '#F05EBA',
                color: 'white',
              },
            }}
          >
            Admin
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Description */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        
        {mode === 'ADMIN' && (
          <Typography
            sx={{
              color: '#560D30',
              fontSize: { xs: '12px', sm: '14px' },
              fontFamily: '"Nobile", sans-serif',
              fontStyle: 'italic',
              backgroundColor: 'rgba(150, 242, 247, 0.15)',
              padding: 2,
              borderRadius: 2,
              border: '1px dashed #EC2EA6',
            }}
          >
            Note: Admin accounts require special approval. Your registration will be reviewed by existing administrators.
          </Typography>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            backgroundColor: '#560D30',
            color: '#FFF6F9',
            fontSize: { xs: '14px', sm: '16px' },
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            padding: { xs: '8px 16px', sm: '12px 24px', md: '12px 35px' },
            borderRadius: '10px',
            minWidth: { xs: '100px', sm: '120px' },
            '&:hover': {
              backgroundColor: '#82164A',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(86, 13, 48, 0.3)',
            },
          }}
        >
          Previous
        </Button>
        
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          sx={{
            backgroundColor: '#560D30',
            color: '#FFF6F9',
            fontSize: { xs: '14px', sm: '16px' },
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            padding: { xs: '8px 16px', sm: '12px 24px', md: '12px 35px' },
            borderRadius: '10px',
            minWidth: { xs: '100px', sm: '120px' },
            '&:hover': {
              backgroundColor: '#82164A',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(86, 13, 48, 0.3)',
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ModeStep;