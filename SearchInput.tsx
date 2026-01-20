// client/src/components/ui/SearchInput
import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  Box 
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  onClear,
  size = 'medium',
  fullWidth = true,
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
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      width: fullWidth ? '100%' : 'auto',
    }}>
      {/* Иконка поиска */}
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
          src="/assets/search.svg" 
          alt="Search" 
          style={{ 
            width: '100%', 
            height: '100%',
            filter: isFocused ? 'brightness(0.7)' : 'none',
          }} 
        />
      </Box>

      {/* Поле ввода */}
      <TextField
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variant="outlined"
        size={size}
        sx={{
          flex: 1,
          minWidth: 120,
          '& .MuiOutlinedInput-root': {
            height: 30,
            borderRadius: '10px',
            backgroundColor: 'white',
            border: '1px solid #F056B7',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
          },
          '& .MuiInputBase-input': {
            padding: '6px 12px',
            fontSize: '14px',
            color: '#560D30',
            fontFamily: '"Nobile", sans-serif',
            '&::placeholder': {
              color: '#852654',
              opacity: 0.7,
            },
          },
        }}
        InputProps={{
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                size="small"
                sx={{ 
                  color: '#852654',
                  padding: '4px',
                  marginRight: '4px',
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};

export default SearchInput;