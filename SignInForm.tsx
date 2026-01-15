// src/pages/SignIn/components/SignInForm.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI, setAuthToken } from '../../../services/api';

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Загружаем сохраненный email если есть
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await authAPI.login(formData.email, formData.password);
    const data = response.data;
    
    // Проверяем успешность ответа
    if (data && data.success && data.token && data.user) {
      const { token, user } = data;
      
      // Сохраняем email если выбрано "Remember Me"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Login successful:', user);
      
      // Перенаправляем в зависимости от роли
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } else {
      setError('Login failed. Please check your credentials.');
    }
  } catch (err: any) {
    console.error('Login error:', err);
    const errorMessage = err.response?.data?.error || 'Invalid email or password';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '844px',
        margin: '0 auto',
        padding: { xs: 3, sm: 5 },
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
          mb: { xs: 3, sm: 4 },
          textTransform: 'capitalize',
        }}
      >
        Welcome Back!
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 76, 76, 0.1)',
            '& .MuiAlert-icon': {
              color: '#FF4C4C',
            },
          }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Поле для Email/Username */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '80px',
              }}
            >
              Email
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="standard"
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
                borderBottom: '2px solid #EC2EA6',
                '&:before': { borderBottom: 'none' },
                '&:after': { borderBottom: 'none' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
              },
              flex: 1,
            }}
            placeholder="Enter your email"
          />
        </Box>

        {/* Поле для пароля */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Typography
              sx={{
                color: '#852654',
                fontSize: '16px',
                fontFamily: '"Nobile", sans-serif',
                minWidth: '80px',
              }}
            >
              Password
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            variant="standard"
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
                borderBottom: '2px solid #EC2EA6',
                '&:before': { borderBottom: 'none' },
                '&:after': { borderBottom: 'none' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
              },
              flex: 1,
            }}
            placeholder="Enter your password"
          />
        </Box>

        {/* Remember Me checkbox */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{
                  color: '#F056B7',
                  '&.Mui-checked': {
                    color: '#F056B7',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  color: '#852654',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                }}
              >
                Remember Me
              </Typography>
            }
          />
        </Box>

        {/* Кнопка Sign In */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#560D30',
              color: '#FFF6F9',
              padding: '12px 35px',
              fontSize: '16px',
              fontFamily: '"McLaren", cursive',
              fontWeight: 400,
              borderRadius: '10px',
              minWidth: '140px',
              '&:hover': {
                backgroundColor: '#82164A',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(86, 13, 48, 0.3)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(86, 13, 48, 0.5)',
              },
              '&.MuiButton-root': {
                textTransform: 'none',
              },
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </Box>

      {/* Demo accounts hint (скрыто по умолчанию, можно показать в деве) */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            mt: 4,
            p: 2,
            backgroundColor: 'rgba(150, 242, 247, 0.15)',
            borderRadius: 2,
            border: '1px dashed rgba(86, 13, 48, 0.3)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#560D30',
              fontSize: '14px',
              fontFamily: '"Nobile", sans-serif',
              textAlign: 'center',
            }}
          >
            Demo: admin@collector.com / admin123
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SignInForm;