// client/src/components/ui/SortSelect
import React from 'react';
import { 
  Select, 
  MenuItem, 
  FormControl,
  SelectChangeEvent,
  Box,
} from '@mui/material';

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  placeholder?: string;
    options?: Array<{ value: string; label: string }>; // Добавим кастомные опции
}

const SortSelect: React.FC<SortSelectProps> = ({
  value,
  onChange,
  size = 'small',
  fullWidth = false,
  placeholder = 'Sort by',
    options, 
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

 const sortOptions = options || [ // Используем кастомные или стандартные
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'condition', label: 'By Condition' },
    { value: 'series', label: 'By Series' },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      width: fullWidth ? '100%' : 'auto',
    }}>
      {/* Иконка сортировки */}
      <Box 
        sx={{ 
          width: 30, 
          height: 30, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img 
          src="/assets/sort.svg" 
          alt="Sort" 
          style={{ 
            width: '100%', 
            height: '100%',
          }} 
        />
      </Box>

      {/* Выпадающий список */}
      <FormControl 
        size={size} 
        sx={{ 
          minWidth: 180,
          flex: 1,
          '& .MuiOutlinedInput-root': {
            height: 30,
            borderRadius: '10px',
            backgroundColor: 'white',
            border: '1px solid #F056B7',
          }
        }}
      >
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          sx={{
            borderRadius: '10px',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiSelect-select': {
              padding: '6px 32px 6px 12px',
              fontSize: '14px',
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
            },
            '&:hover': {
              borderColor: '#EC2EA6',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '10px',
                marginTop: '4px',
                border: '1px solid #EC2EA6',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '& .MuiMenuItem-root': {
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '14px',
                  color: '#560D30',
                  '&:hover': {
                    backgroundColor: 'rgba(236, 46, 166, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(236, 46, 166, 0.2)',
                    color: '#560D30',
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            <span style={{ color: '#852654', fontStyle: 'normal' }}>{placeholder}</span>
          </MenuItem>
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortSelect;