// src/pages/CheckIn/components/SubmitStep.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { authAPI, setAuthToken } from '../../../services/api';

interface SubmitStepProps {
  onBack: () => void;
  userData: any;
  mode: 'SIMPLE' | 'ADMIN'; // Измените PARENTAL на ADMIN
}

const SubmitStep: React.FC<SubmitStepProps> = ({ onBack, userData, mode }) => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

const handleSubmit = async () => {
  if (!agreed) {
    setError('Please agree to the Terms of Service and Privacy Policy');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const registrationData = {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      age: userData.age ? parseInt(userData.age) : null,
      parentEmail: userData.parentEmail || null,
      region: userData.region,
      // Добавляем роль в зависимости от режима
      role: mode === 'ADMIN' ? 'ADMIN' : 'USER',
    };

    const response = await authAPI.register(registrationData);
    const data = response.data;

    if (data && data.success && data.token && data.user) {
      const { token, user } = data;
      
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess(mode === 'ADMIN' 
        ? 'Admin account created successfully! Pending approval.' 
        : 'Account created successfully!');
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } else {
      setError(data?.error || 'Registration failed. Please try again.');
    }
  } catch (err: any) {
    console.error('Registration error:', err);
    
    if (err.response?.data?.error) {
      setError(err.response.data.error);
    } else if (err.response?.status === 400) {
      setError('User with this email already exists');
    } else {
      setError('Registration failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleOpenTerms = () => {
    setTermsDialogOpen(true);
  };

  const handleCloseTerms = () => {
    setTermsDialogOpen(false);
  };

  return (
    <>
      <Box
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
          Review & Submit
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
          Please review your information and agree to our terms to complete registration
        </Typography>

        {success && (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
            }}
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 76, 76, 0.1)',
            }}
          >
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'rgba(150, 242, 247, 0.15)',
            borderRadius: 2,
            padding: { xs: 2, sm: 3 },
            border: '1px solid rgba(86, 13, 48, 0.2)',
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#560D30',
              fontSize: { xs: '16px', sm: '18px' },
              fontFamily: '"McLaren", cursive',
              mb: 2,
            }}
          >
            Account Details
          </Typography>

          <List disablePadding>
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemText
                primary="Username"
                secondary={userData.username}
                primaryTypographyProps={{
                  color: '#852654',
                  fontSize: '14px',
                  fontFamily: '"Nobile", sans-serif',
                }}
                secondaryTypographyProps={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 500,
                }}
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemText
                primary="Email"
                secondary={userData.email}
                primaryTypographyProps={{
                  color: '#852654',
                  fontSize: '14px',
                  fontFamily: '"Nobile", sans-serif',
                }}
                secondaryTypographyProps={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 500,
                }}
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemText
                primary="Age"
                secondary={userData.age || 'Not specified'}
                primaryTypographyProps={{
                  color: '#852654',
                  fontSize: '14px',
                  fontFamily: '"Nobile", sans-serif',
                }}
                secondaryTypographyProps={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 500,
                }}
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemText
                primary="Region"
                secondary={userData.region}
                primaryTypographyProps={{
                  color: '#852654',
                  fontSize: '14px',
                  fontFamily: '"Nobile", sans-serif',
                }}
                secondaryTypographyProps={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 500,
                }}
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemText
                primary="Location"
                secondary={userData.location || 'Not specified'}
                primaryTypographyProps={{
                  color: '#852654',
                  fontSize: '14px',
                  fontFamily: '"Nobile", sans-serif',
                }}
                secondaryTypographyProps={{
                  color: '#560D30',
                  fontSize: '16px',
                  fontFamily: '"Nobile", sans-serif',
                  fontWeight: 500,
                }}
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding sx={{ py: 1 }}>
  <ListItemText
    primary="User Mode"
    secondary={mode === 'SIMPLE' ? 'Simple (Regular User)' : 'Admin (Platform Manager)'} // Исправьте текст
    primaryTypographyProps={{
      color: '#852654',
      fontSize: '14px',
      fontFamily: '"Nobile", sans-serif',
    }}
    secondaryTypographyProps={{
      color: '#560D30',
      fontSize: '16px',
      fontFamily: '"Nobile", sans-serif',
      fontWeight: 500,
    }}
  />
</ListItem>
          </List>
        </Paper>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            mb: 4,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setError('');
                }}
                sx={{
                  color: '#F056B7',
                  '&.Mui-checked': {
                    color: '#F056B7',
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  color: '#560D30',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontFamily: '"Nobile", sans-serif',
                }}
              >
                I agree to the{' '}
                <Button
                  onClick={handleOpenTerms}
                  sx={{
                    color: '#EC2EA6',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'none',
                    },
                  }}
                >
                  Terms of Service
                </Button>{' '}
                and{' '}
                <Button
                  onClick={handleOpenTerms}
                  sx={{
                    color: '#EC2EA6',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'none',
                    },
                  }}
                >
                  Privacy Policy
                </Button>
              </Typography>
            }
          />

          <Typography
            sx={{
              color: '#82164A',
              fontSize: '12px',
              fontFamily: '"Nobile", sans-serif',
              textAlign: 'center',
              maxWidth: '600px',
            }}
          >
            By creating an account, you agree to follow our community guidelines, 
            respect other collectors, and engage in safe and fair trading practices.
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            disabled={loading}
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
              },
              '&:disabled': {
                backgroundColor: 'rgba(86, 13, 48, 0.5)',
              },
            }}
          >
            Previous
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !agreed}
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
              },
              '&:disabled': {
                backgroundColor: 'rgba(86, 13, 48, 0.5)',
              },
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>
      </Box>

      {/* Terms Dialog */}
      <Dialog
        open={termsDialogOpen}
        onClose={handleCloseTerms}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: '#FFF6F9',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#560D30',
            color: 'white',
            fontFamily: '"McLaren", cursive',
            position: 'relative',
          }}
        >
          Terms of Service & Privacy Policy
          <IconButton
            aria-label="close"
            onClick={handleCloseTerms}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4 }}>
          <Typography variant="h6" sx={{ color: '#560D30', mb: 2, fontFamily: '"McLaren", cursive' }}>
            Collector Mingle Community Guidelines
          </Typography>
          
          <List>
            {[
              'Respect all members of the community',
              'Engage in fair and honest trading practices',
              'Provide accurate descriptions of items for trade',
              'Communicate clearly and promptly with trading partners',
              'Report any suspicious or inappropriate behavior',
              'Do not share personal contact information publicly',
              'Keep all transactions within the platform for safety',
              'Be respectful of different collecting preferences and levels',
            ].map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <Typography sx={{ color: '#82164A', fontFamily: '"Nobile", sans-serif' }}>
                  • {item}
                </Typography>
              </ListItem>
            ))}
          </List>
          
          <Typography variant="h6" sx={{ color: '#560D30', mt: 3, mb: 2, fontFamily: '"McLaren", cursive' }}>
            Privacy Policy
          </Typography>
          
          <Typography sx={{ color: '#82164A', fontFamily: '"Nobile", sans-serif', mb: 2 }}>
            We respect your privacy and are committed to protecting your personal information. 
            We will never sell your data to third parties. Your email and contact information 
            will only be used for account verification and platform communications.
          </Typography>
          
          <Typography sx={{ color: '#82164A', fontFamily: '"Nobile", sans-serif', mb: 2 }}>
            For users under 18, parent/guardian email is required for supervision. 
            All communications can be monitored by parents/guardians upon request.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, backgroundColor: 'rgba(86, 13, 48, 0.05)' }}>
          <Button
            onClick={handleCloseTerms}
            sx={{
              color: '#560D30',
              fontFamily: '"Nobile", sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(86, 13, 48, 0.1)',
              },
            }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubmitStep;