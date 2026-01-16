// src/pages/CheckIn/components/InfoStep.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
  LocationOn,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Region } from '../../../services/types';

interface InfoStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const InfoStep: React.FC<InfoStepProps> = ({ onNext, onBack, initialData = {} }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    username: initialData.username || '',
    email: initialData.email || '',
    password: initialData.password || '',
    confirmPassword: initialData.confirmPassword || '',
    age: initialData.age || '',
    parentEmail: initialData.parentEmail || '',
    phone: initialData.phone || '',
    region: initialData.region || 'CIS',
    location: initialData.location || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Age validation (optional, but if provided must be valid)
    if (formData.age && (Number(formData.age) < 1 || Number(formData.age) > 120)) {
      newErrors.age = 'Please enter a valid age';
    }

    // If age is under 18, require parent email
    if (formData.age && Number(formData.age) < 18 && !formData.parentEmail.trim()) {
      newErrors.parentEmail = 'Parent email is required for users under 18';
    }

    // Parent email validation (if provided)
    if (formData.parentEmail.trim() && !emailRegex.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid parent email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: '844px',
        margin: '0 auto',
        padding: { xs: 3, sm: 4, md: 5 },
        background: 'rgba(255, 255, 255, 0.42)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
          fontFamily: '"McLaren", cursive',
          color: '#560D30',
          textAlign: 'center',
          mb: { xs: 3, sm: 4, md: 5 },
          textTransform: 'capitalize',
        }}
      >
        User Information
      </Typography>

      <Typography
        sx={{
          color: '#82164A',
          fontSize: { xs: '14px', sm: '16px' },
          fontFamily: '"Nobile", sans-serif',
          textAlign: 'center',
          mb: 4,
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        Please fill in your details to create your collector account
      </Typography>

      {Object.keys(errors).length > 0 && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 76, 76, 0.1)',
          }}
        >
          Please fix the errors below to continue.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Username */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '100px',
              }}
            >
              Username
            </Typography>
            <TextField
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="standard"
              required
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#EC2EA6' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#560D30',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '16px',
                },
              }}
              sx={{
                '& .MuiInput-root': {
                  borderBottom: errors.username ? '2px solid #FF4C4C' : '2px solid #EC2EA6',
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                },
              }}
              placeholder="Choose a username"
            />
          </Box>
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '100px',
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="standard"
              required
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#EC2EA6' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#560D30',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '16px',
                },
              }}
              sx={{
                '& .MuiInput-root': {
                  borderBottom: errors.email ? '2px solid #FF4C4C' : '2px solid #EC2EA6',
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                },
              }}
              placeholder="your.email@example.com"
            />
          </Box>
        </Grid>

        {/* Password */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '100px',
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              variant="standard"
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#EC2EA6' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#EC2EA6' }}
                      type="button"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: '#560D30',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '16px',
                },
              }}
              sx={{
                '& .MuiInput-root': {
                  borderBottom: errors.password ? '2px solid #FF4C4C' : '2px solid #EC2EA6',
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                },
              }}
              placeholder="Create a password"
            />
          </Box>
        </Grid>

        {/* Confirm Password */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '100px',
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="standard"
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#EC2EA6' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#EC2EA6' }}
                      type="button"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: '#560D30',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '16px',
                },
              }}
              sx={{
                '& .MuiInput-root': {
                  borderBottom: errors.confirmPassword ? '2px solid #FF4C4C' : '2px solid #EC2EA6',
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                },
              }}
              placeholder="Confirm your password"
            />
          </Box>
        </Grid>

        {/* Age */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '100px',
              }}
            >
              Age (Optional)
            </Typography>
            <TextField
              fullWidth
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              variant="standard"
              error={!!errors.age}
              helperText={errors.age}
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: '#560D30',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '16px',
                },
              }}
              sx={{
                '& .MuiInput-root': {
                  borderBottom: errors.age ? '2px solid #FF4C4C' : '2px solid #EC2EA6',
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                },
              }}
              placeholder="Your age"
              inputProps={{ min: 1, max: 120 }}
            />
          </Box>
        </Grid>

        {/* Parent Email (if under 18) */}
        {formData.age && Number(formData.age) < 18 && (
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                sx={{
                  color: '#852654',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                  minWidth: '100px',
                }}
              >
                Parent Email
              </Typography>
              <TextField
                fullWidth
                name="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={handleChange}
                variant="standard"
                required={Number(formData.age) < 18}
                error={!!errors.parentEmail}
                helperText={errors.parentEmail}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#EC2EA6' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    color: '#560D30',
                    fontFamily: '"Nobile", sans-serif',
                    fontSize: '16px',
                  },
                }}
                sx={{
                  '& .MuiInput-root': {
                    borderBottom: errors.parentEmail ? '2px solid #FF4C4C' : '2px solid #EC2EA6',
                    '&:before': { borderBottom: 'none' },
                    '&:after': { borderBottom: 'none' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                  },
                }}
                placeholder="parent@example.com"
              />
            </Box>
          </Grid>
        )}

        {/* Region */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '100px',
              }}
            >
              Region
            </Typography>
            <FormControl fullWidth variant="standard">
              <Select
                value={formData.region}
                onChange={handleChange}
                name="region"
                sx={{
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '& .MuiSelect-select': {
                    borderBottom: '2px solid #EC2EA6',
                    color: '#560D30',
                    fontFamily: '"Nobile", sans-serif',
                    fontSize: '16px',
                    paddingBottom: '8px',
                  },
                }}
              >
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="EU">Europe</MenuItem>
                <MenuItem value="CIS">CIS</MenuItem>
                <MenuItem value="ASIA">Asia</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Location */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '100px',
              }}
            >
              Location
            </Typography>
            <TextField
              fullWidth
              name="location"
              value={formData.location}
              onChange={handleChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: '#EC2EA6' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#560D30',
                  fontFamily: '"Nobile", sans-serif',
                  fontSize: '16px',
                },
              }}
              sx={{
                '& .MuiInput-root': {
                  borderBottom: '2px solid #EC2EA6',
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                },
              }}
              placeholder="City, Country"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          mt: 6,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            backgroundColor: '#560D30',
            color: '#FFF6F9',
            fontSize: { xs: '14px', sm: '16px' },
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            padding: { xs: '8px 16px', sm: '12px 24px', md: '12px 35px' },
            borderRadius: '10px',
            minWidth: { xs: '100px', sm: '120px' },
            '&:hover': {
              backgroundColor: '#82164A',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(86, 13, 48, 0.3)',
            },
          }}
        >
          Previous
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#560D30',
            color: '#FFF6F9',
            fontSize: { xs: '14px', sm: '16px' },
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            padding: { xs: '8px 16px', sm: '12px 24px', md: '12px 35px' },
            borderRadius: '10px',
            minWidth: { xs: '100px', sm: '120px' },
            '&:hover': {
              backgroundColor: '#82164A',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(86, 13, 48, 0.3)',
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default InfoStep;