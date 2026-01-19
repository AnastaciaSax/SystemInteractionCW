// client/src/components/forms/TradeAdForm/TradeAdForm.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import ImageUpload from './ImageUpload';
import FilterSelect from '../ui/FilterSelect';

interface TradeAdFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  submitText?: string;
}

const TradeAdForm: React.FC<TradeAdFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  title = 'Create TradeAd',
  submitText = 'Save',
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    condition: initialData.condition || 'MINT',
    series: initialData.series || 'G2',
    region: initialData.region || 'USA',
    photo: initialData.photo || null,
    location: initialData.location || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.photo && !initialData.photo) {
      newErrors.photo = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const conditionOptions = [
    { value: 'MINT', label: 'Mint' },
    { value: 'TLC', label: 'Needs TLC' },
    { value: 'GOOD', label: 'Good' },
    { value: 'NIB', label: 'New in Box' },
  ];

  const seriesOptions = [
    { value: 'G2', label: 'G2' },
    { value: 'G3', label: 'G3' },
    { value: 'G4', label: 'G4' },
    { value: 'G5', label: 'G5' },
    { value: 'G6', label: 'G6' },
    { value: 'G7', label: 'G7' },
    { value: 'OTHER', label: 'Other' },
  ];

  const regionOptions = [
    { value: 'USA', label: 'USA' },
    { value: 'EU', label: 'Europe' },
    { value: 'CIS', label: 'CIS' },
    { value: 'ASIA', label: 'Asia' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
          fontFamily: '"McLaren", cursive',
          color: '#560D30',
          textAlign: 'center',
          mb: 4,
          textTransform: 'capitalize',
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={3}>
        {/* Photo Upload */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: 80,
              }}
            >
              Photo:
            </Typography>
            <ImageUpload
              initialImage={formData.photo}
              onImageUpload={(file) => handleChange('photo', file)}
              error={errors.photo}
            />
          </Box>
          {errors.photo && (
            <Typography color="error" sx={{ fontSize: '12px', ml: 12 }}>
              {errors.photo}
            </Typography>
          )}
        </Grid>

        {/* Title */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: 80,
              }}
            >
              Title:
            </Typography>
            <TextField
              name="title"
              value={formData.title}
              onChange={handleTextChange}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: errors.title ? '#FF4C4C' : '#EC2EA6',
                  },
                },
              }}
            />
          </Box>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: 80,
                mt: 1,
              }}
            >
              Description:
            </Typography>
            <TextField
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              fullWidth
              multiline
              rows={4}
              required
              error={!!errors.description}
              helperText={errors.description}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: errors.description ? '#FF4C4C' : '#EC2EA6',
                  },
                },
              }}
            />
          </Box>
        </Grid>

        {/* Location */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              sx={{
                color: '#82164A',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: 80,
              }}
            >
              Location:
            </Typography>
            <TextField
              name="location"
              value={formData.location}
              onChange={handleTextChange}
              fullWidth
              required
              error={!!errors.location}
              helperText={errors.location}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: errors.location ? '#FF4C4C' : '#EC2EA6',
                  },
                },
              }}
              placeholder="City, Country"
            />
          </Box>
        </Grid>

        {/* Condition */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              sx={{
                color: '#82164A',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: 80,
              }}
            >
              Condition:
            </Typography>
            <FilterSelect
              label=""
              value={formData.condition}
              options={conditionOptions}
              onChange={(value) => handleChange('condition', value)}
              fullWidth
            />
          </Box>
        </Grid>

        {/* Series */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              sx={{
                color: '#82164A',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: 80,
              }}
            >
              Series:
            </Typography>
            <FilterSelect
              label=""
              value={formData.series}
              options={seriesOptions}
              onChange={(value) => handleChange('series', value)}
              fullWidth
            />
          </Box>
        </Grid>

        {/* Region */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              sx={{
                color: '#82164A',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: 80,
              }}
            >
              Region:
            </Typography>
            <FilterSelect
              label=""
              value={formData.region}
              options={regionOptions}
              onChange={(value) => handleChange('region', value)}
              fullWidth
            />
          </Box>
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          mt: 4,
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: '#560D30',
            color: '#FFF6F9',
            fontSize: '16px',
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            padding: '12px 35px',
            borderRadius: '10px',
            minWidth: '120px',
            '&:hover': {
              backgroundColor: '#82164A',
            },
            '&:disabled': {
              backgroundColor: 'rgba(86, 13, 48, 0.5)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#FFF6F9' }} /> : submitText}
        </Button>
        
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          sx={{
            borderColor: '#560D30',
            color: '#560D30',
            fontSize: '16px',
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            padding: '12px 35px',
            borderRadius: '10px',
            minWidth: '120px',
            '&:hover': {
              borderColor: '#82164A',
              color: '#82164A',
            },
            '&:disabled': {
              borderColor: 'rgba(86, 13, 48, 0.5)',
              color: 'rgba(86, 13, 48, 0.5)',
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default TradeAdForm;