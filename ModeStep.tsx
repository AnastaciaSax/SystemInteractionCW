// src/pages/CheckIn/components/ModeStep.tsx
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
  onNext: (mode: 'SIMPLE' | 'PARENTAL') => void;
  onBack: () => void;
  initialMode?: 'SIMPLE' | 'PARENTAL';
}

const ModeStep: React.FC<ModeStepProps> = ({ onNext, onBack, initialMode = 'SIMPLE' }) => {
  const [mode, setMode] = useState<'SIMPLE' | 'PARENTAL'>(initialMode);

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'SIMPLE' | 'PARENTAL' | null,
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

      <Typography
        sx={{
          color: '#82164A',
          fontSize: { xs: '14px', sm: '16px' },
          fontFamily: '"Nobile", sans-serif',
          textAlign: 'center',
          mb: 4,
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        Choose how you want to experience Collector Mingle
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
            value="PARENTAL" 
            aria-label="parental mode"
            disabled
            sx={{
              color: 'rgba(86, 13, 48, 0.5) !important',
              cursor: 'not-allowed',
              '&.Mui-selected': {
                backgroundColor: 'rgba(240, 94, 186, 0.5) !important',
              },
            }}
          >
            Parental (Coming Soon)
          </ToggleButton>
        </ToggleButtonGroup>

        <Box
          sx={{
            backgroundColor: 'rgba(150, 242, 247, 0.15)',
            borderRadius: 2,
            padding: { xs: 2, sm: 3 },
            border: '1px solid rgba(86, 13, 48, 0.2)',
            maxWidth: '600px',
          }}
        >
          <Typography
            sx={{
              color: '#560D30',
              fontSize: { xs: '14px', sm: '16px' },
              fontFamily: '"Nobile", sans-serif',
              mb: 1,
              fontWeight: 600,
            }}
          >
            {mode === 'SIMPLE' ? 'Simple Mode:' : 'Parental Mode:'}
          </Typography>
          <Typography
            sx={{
              color: '#82164A',
              fontSize: { xs: '13px', sm: '14px' },
              fontFamily: '"Nobile", sans-serif',
            }}
          >
            {mode === 'SIMPLE'
              ? 'Full access to all features for collectors 18+. You can trade, chat with other collectors, and manage your collection independently.'
              : 'Limited access for collectors under 18. All activities are supervised by a parent or guardian.'}
          </Typography>
        </Box>
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