// client/src/components/ui/SeriesFilter
import React from 'react';
import { Box } from '@mui/material';

interface SeriesFilterProps {
  series: string[];
  selectedSeries: string;
  onSeriesChange: (series: string) => void;
  variant?: 'chips' | 'buttons';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const SeriesFilter: React.FC<SeriesFilterProps> = ({
  series,
  selectedSeries,
  onSeriesChange,
  variant = 'buttons',
  size = 'medium',
  fullWidth = true,
}) => {
  const handleSeriesClick = (seriesName: string) => {
    // Если уже выбрана эта серия - сбрасываем выбор
    if (selectedSeries === seriesName) {
      onSeriesChange('');
    } else {
      onSeriesChange(seriesName);
    }
  };

  if (variant === 'buttons') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          backgroundColor: 'white',
          borderRadius: '10px',
          border: '1px solid #EC2EA6',
          overflow: 'hidden',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        {series.map((s) => (
          <Box
            key={s}
            onClick={() => handleSeriesClick(s)}
            sx={{
              flex: 1,
              minWidth: 'fit-content',
              textAlign: 'center',
              backgroundColor: selectedSeries === s ? '#F05EBA' : 'transparent',
              color: selectedSeries === s ? 'white' : '#560D30',
              padding: size === 'small' ? '8px 12px' : '10px 16px',
              fontFamily: '"McLaren", cursive',
              fontSize: size === 'small' ? '16px' : '20px',
              fontWeight: 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderRight: '1px solid rgba(236, 46, 166, 0.2)',
              '&:last-child': {
                borderRight: 'none',
              },
              '&:hover': {
                backgroundColor: selectedSeries === s ? '#F056B7' : 'rgba(240, 94, 186, 0.1)',
              },
            }}
          >
            {s}
          </Box>
        ))}
      </Box>
    );
  }

  // Чипсы вариант
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: fullWidth ? 'center' : 'flex-start',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: 1.5,
        border: '1px solid #EC2EA6',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {series.map((s) => (
        <Box
          key={s}
          onClick={() => handleSeriesClick(s)}
          sx={{
            padding: '6px 16px',
            backgroundColor: selectedSeries === s ? '#F05EBA' : 'transparent',
            color: selectedSeries === s ? 'white' : '#560D30',
            borderRadius: '20px',
            border: `1px solid ${selectedSeries === s ? '#F05EBA' : '#EC2EA6'}`,
            fontFamily: '"McLaren", cursive',
            fontSize: '16px',
            fontWeight: 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: selectedSeries === s ? '#F056B7' : 'rgba(240, 94, 186, 0.1)',
            },
          }}
        >
          {s}
        </Box>
      ))}
    </Box>
  );
};

export default SeriesFilter;