import React from 'react';
import { Box, Typography } from '@mui/material';

interface VerticalToggleButtonsProps {
  mode: 'chat' | 'forum';
  onModeChange: (mode: 'chat' | 'forum') => void;
}

const VerticalToggleButtons: React.FC<VerticalToggleButtonsProps> = ({ mode, onModeChange }) => {
  return (
    <Box sx={{ 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      gap: 2, 
      display: 'inline-flex' 
    }}>
      <Box
        onClick={() => onModeChange('chat')}
        sx={{
          width: 197,
          padding: '6px 19px',
          background: mode === 'chat' ? 'var(--checked, #EC2EA6)' : 'var(--brand, #F6C4D4)',
          boxShadow: '0px 0px 4px #E1E2FF',
          borderRadius: '5px',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 1,
          display: 'inline-flex',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(2px)',
            boxShadow: '0px 4px 8px rgba(236, 46, 166, 0.3)',
          },
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            color: mode === 'chat' ? 'white' : '#82164A',
            fontSize: 15,
            fontFamily: '"Nobile", sans-serif',
            fontWeight: 400,
          }}
        >
          CHAT
        </Typography>
      </Box>
      
      <Box
        onClick={() => onModeChange('forum')}
        sx={{
          width: 197,
          padding: '6px 19px',
          background: mode === 'forum' ? 'var(--checked, #EC2EA6)' : 'var(--brand, #F6C4D4)',
          boxShadow: '0px 0px 4px #E1E2FF',
          borderRadius: '5px',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 1,
          display: 'inline-flex',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(2px)',
            boxShadow: '0px 4px 8px rgba(236, 46, 166, 0.3)',
          },
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            color: mode === 'forum' ? 'white' : '#82164A',
            fontSize: 15,
            fontFamily: '"Nobile", sans-serif',
            fontWeight: 400,
          }}
        >
          FORUM
        </Typography>
      </Box>
    </Box>
  );
};

export default VerticalToggleButtons;