// client/src/components/ui/YearRangeFilter.tsx
import React from 'react';
import { Box } from '@mui/material';

interface YearRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const YearRangeFilter: React.FC<YearRangeFilterProps> = ({ value, onChange }) => {
  const yearRanges = [
    '2005-2008',
    '2009-2013', 
    '2014-2017',
    '2018-2022',
    '2023-2025'
  ];

  const handleYearClick = (yearRange: string) => {
    // Если уже выбрана эта опция - сбрасываем выбор
    if (value === yearRange) {
      onChange('ALL');
    } else {
      onChange(yearRange);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: 37,
        background: 'white',
        borderRadius: '10px',
        outline: '1px solid #EC2EA6',
        outlineOffset: '-1px',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {yearRanges.map((range, index) => (
        <Box
          key={range}
          onClick={() => handleYearClick(range)}
          sx={{
            flex: '1 1 0',
            alignSelf: 'stretch',
            background: value === range ? '#F05EBA' : 'transparent',
            borderRadius: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            display: 'flex',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: value === range ? '#F05EBA' : 'rgba(240, 94, 186, 0.1)',
            },
          }}
        >
          <Box
            sx={{
              flex: '1 1 0',
              alignSelf: 'stretch',
              textAlign: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: value === range ? 'white' : '#560D30',
              fontSize: { xs: 16, sm: 18, md: 20 },
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              wordWrap: 'break-word',
              padding: '4px 0',
            }}
          >
            {range}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default YearRangeFilter;