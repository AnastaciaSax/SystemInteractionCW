// client/src/components/ui/ToggleSwitch/ToggleSwitch.tsx
import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';

interface ToggleSwitchProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  options,
  value,
  onChange,
  variant = 'filled',
  size = 'medium',
  fullWidth = false,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: '4px 12px', fontSize: '14px', minHeight: '32px' };
      case 'large':
        return { padding: '12px 24px', fontSize: '18px', minHeight: '48px' };
      default:
        return { padding: '8px 16px', fontSize: '16px', minHeight: '40px' };
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '10px',
        border: variant === 'outlined' ? '1px solid #EC2EA6' : 'none',
        overflow: 'hidden',
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <ButtonGroup 
        disableElevation 
        variant={variant === 'outlined' ? 'outlined' : 'contained'}
        sx={{ width: fullWidth ? '100%' : 'auto' }}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              flex: 1,
              backgroundColor: value === option.value ? '#EC2EA6' : 'transparent',
              color: value === option.value ? 'white' : '#560D30',
              borderColor: '#EC2EA6',
              borderRadius: '10px',
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: value === option.value ? '#F056B7' : 'rgba(236, 46, 166, 0.1)',
                borderColor: '#EC2EA6',
              },
              ...getSizeStyles(),
            }}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default ToggleSwitch;