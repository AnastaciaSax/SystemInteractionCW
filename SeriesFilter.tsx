// client/src/components/ui/SeriesFilter/SeriesFilter.tsx
import React from 'react';
import { Box, Chip } from '@mui/material';

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
  variant = 'chips',
  size = 'medium',
  fullWidth = false,
}) => {
  const getSeriesColor = (seriesName: string) => {
    const colors: Record<string, string> = {
      'G2': '#F05EBA',
      'G3': '#EC2EA6',
      'G4': '#F056B7',
      'G5': '#D81B60',
      'G6': '#C2185B',
      'G7': '#AD1457',
      'OTHER': '#560D30',
    };
    return colors[seriesName] || '#852654';
  };

  if (variant === 'buttons') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: 1,
          border: '1px solid #EC2EA6',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        {series.map((s) => (
          <Chip
            key={s}
            label={s}
            onClick={() => onSeriesChange(s)}
            sx={{
              backgroundColor: selectedSeries === s ? getSeriesColor(s) : 'transparent',
              color: selectedSeries === s ? 'white' : '#560D30',
              border: `1px solid ${getSeriesColor(s)}`,
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              fontSize: size === 'small' ? '14px' : '16px',
              height: size === 'small' ? '32px' : '40px',
              '&:hover': {
                backgroundColor: selectedSeries === s ? getSeriesColor(s) : 'rgba(240, 94, 186, 0.1)',
              },
            }}
          />
        ))}
      </Box>
    );
  }

  // Chip variant (default)
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: fullWidth ? 'space-between' : 'flex-start',
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
          onClick={() => onSeriesChange(s)}
          sx={{
            flex: '1 0 auto',
            textAlign: 'center',
            backgroundColor: selectedSeries === s ? '#F05EBA' : 'transparent',
            color: selectedSeries === s ? 'white' : '#560D30',
            borderRadius: '10px',
            padding: size === 'small' ? '4px 8px' : '8px 12px',
            fontFamily: '"McLaren", cursive',
            fontSize: size === 'small' ? '16px' : '20px',
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