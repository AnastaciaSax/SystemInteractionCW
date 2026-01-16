// src/components/StepIndicator/StepIndicator.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    number: number;
    label: string;
  }>;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1, sm: 2, md: 3 },
        mb: { xs: 4, md: 6 },
        flexWrap: 'wrap',
      }}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              minWidth: { xs: '70px', sm: '90px', md: '100px' },
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 45, md: 50 },
                height: { xs: 40, sm: 45, md: 50 },
                borderRadius: '50%',
                backgroundColor: step.number <= currentStep ? '#F05EBA' : 'rgba(255, 255, 255, 0.35)',
                border: step.number <= currentStep ? 'none' : '1px solid #F05EBA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step.number <= currentStep ? 'white' : '#560D30',
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                fontFamily: '"McLaren", cursive',
                fontWeight: 400,
                transition: 'all 0.3s ease',
              }}
            >
              {step.number}
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '12px', sm: '14px', md: '16px' },
                fontFamily: '"Nobile", sans-serif',
                color: step.number <= currentStep ? '#EC2EA6' : '#852654',
                textAlign: 'center',
                fontWeight: step.number <= currentStep ? 600 : 400,
              }}
            >
              {step.label}
            </Typography>
          </Box>
          
          {index < steps.length - 1 && (
            <Box
              sx={{
                width: { xs: 30, sm: 40, md: 50 },
                height: '2px',
                backgroundColor: step.number < currentStep ? '#F05EBA' : 'rgba(86, 13, 48, 0.5)',
                mx: { xs: 0.5, sm: 1 },
                transition: 'background-color 0.3s ease',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default StepIndicator;