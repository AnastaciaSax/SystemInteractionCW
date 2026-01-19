// client/src/components/ui/FilterSelect/FilterSelect.tsx
import React from 'react';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  SelectChangeEvent 
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface FilterSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
  size = 'small',
  fullWidth = false,
  disabled = false,
  placeholder,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl 
      size={size} 
      sx={{ 
        minWidth: fullWidth ? '100%' : 120,
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          backgroundColor: 'white',
        }
      }}
      disabled={disabled}
    >
      <InputLabel 
        shrink 
        sx={{ 
          color: '#82164A',
          fontFamily: '"Nobile", sans-serif',
          fontWeight: 400,
          transform: 'translate(0, -20px)',
          '&.Mui-focused': {
            color: '#560D30',
          }
        }}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        IconComponent={ArrowDropDownIcon}
        sx={{
          borderRadius: '10px',
          backgroundColor: 'white',
          border: '1px solid #F056B7',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-select': {
            color: '#560D30',
            fontFamily: '"Nobile", sans-serif',
            fontSize: size === 'small' ? '14px' : '16px',
            padding: size === 'small' ? '8px 32px 8px 12px' : '12px 32px 12px 16px',
          },
          '&:hover': {
            borderColor: '#EC2EA6',
          },
          '&.Mui-focused': {
            borderColor: '#560D30',
            boxShadow: '0 0 0 2px rgba(86, 13, 48, 0.1)',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '10px',
              marginTop: '8px',
              border: '1px solid #EC2EA6',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              '& .MuiMenuItem-root': {
                fontFamily: '"Nobile", sans-serif',
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
        {placeholder && (
          <MenuItem value="" disabled>
            <em style={{ color: '#852654', fontStyle: 'normal' }}>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;