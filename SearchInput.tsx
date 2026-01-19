// client/src/components/ui/SearchInput/SearchInput.tsx
import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  Box 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  iconPosition?: 'start' | 'end';
  variant?: 'standard' | 'outlined' | 'filled';
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  onClear,
  size = 'medium',
  fullWidth = true,
  iconPosition = 'start',
  variant = 'outlined',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variant={variant}
        size={size}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: 'white',
            '& fieldset': {
              borderColor: isFocused ? '#560D30' : '#F056B7',
            },
            '&:hover fieldset': {
              borderColor: '#EC2EA6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#560D30',
              boxShadow: '0 0 0 2px rgba(86, 13, 48, 0.1)',
            },
          },
          width: '100%',
        }}
        InputProps={{
          startAdornment: iconPosition === 'start' && (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: isFocused ? '#560D30' : '#852654' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton
                  onClick={handleClear}
                  size="small"
                  sx={{ color: '#852654', mr: 1 }}
                >
                  <ClearIcon />
                </IconButton>
              )}
              {iconPosition === 'end' && (
                <IconButton
                  onClick={() => onSearch?.()}
                  sx={{ color: '#560D30' }}
                >
                  <SearchIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchInput;