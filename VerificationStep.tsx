// src/pages/CheckIn/components/VerificationStep.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';

interface VerificationStepProps {
  onNext: () => void;
  onBack: () => void;
  email: string;
  onResendCode: () => Promise<{ success: boolean; message: string }>;
  onVerifyCode: (code: string) => Promise<{ success: boolean; message: string }>;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ 
  onNext, 
  onBack, 
  email, 
  onResendCode, 
  onVerifyCode 
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Send verification code on component mount
    sendVerificationCode();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendVerificationCode = async () => {
    try {
      const result = await onResendCode();
      if (result.success) {
        setSuccess(`Verification code sent to ${email}`);
        setTimer(60);
        setCanResend(false);
      } else {
        setError(result.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError('Failed to send verification code');
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Move to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Auto-submit if all digits are filled
      if (newCode.every(digit => digit !== '') && index === 5) {
        handleSubmit(newCode.join(''));
      }
      
      setError('');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await sendVerificationCode();
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (verificationCode?: string) => {
    const verificationCodeToCheck = verificationCode || code.join('');
    
    if (verificationCodeToCheck.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await onVerifyCode(verificationCodeToCheck);
      if (result.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          onNext();
        }, 1500);
      } else {
        setError(result.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
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
          mb: { xs: 2, sm: 3 },
          textTransform: 'capitalize',
        }}
      >
        Email Verification
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
        We've sent a verification code to your email address
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(150, 242, 247, 0.15)',
            padding: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: '1px solid rgba(86, 13, 48, 0.2)',
          }}
        >
          <EmailIcon sx={{ color: '#560D30', fontSize: 24 }} />
          <Typography
            sx={{
              color: '#560D30',
              fontSize: { xs: '14px', sm: '16px' },
              fontFamily: '"Nobile", sans-serif',
              fontWeight: 600,
            }}
          >
            {email}
          </Typography>
        </Box>

        {success && (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{
              width: '100%',
              maxWidth: '400px',
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
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'rgba(255, 76, 76, 0.1)',
            }}
          >
            {error}
          </Alert>
        )}

        <Typography
          sx={{
            color: '#560D30',
            fontSize: { xs: '14px', sm: '16px' },
            fontFamily: '"Nobile", sans-serif',
            textAlign: 'center',
            mt: 2,
          }}
        >
          Enter the 6-digit verification code:
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            mb: 4,
          }}
        >
          {code.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#560D30',
                },
              }}
              sx={{
                width: { xs: 45, sm: 55, md: 60 },
                height: { xs: 45, sm: 55, md: 60 },
                '& .MuiInputBase-root': {
                  height: '100%',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  border: error ? '2px solid #FF4C4C' : '2px solid #EC2EA6',
                  '&:hover': {
                    borderColor: '#F056B7',
                  },
                  '&.Mui-focused': {
                    borderColor: '#560D30',
                    boxShadow: '0 0 0 2px rgba(86, 13, 48, 0.1)',
                  },
                },
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                },
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            mb: 4,
          }}
        >
          {canResend ? (
            <Link
              component="button"
              onClick={handleResend}
              disabled={resendLoading}
              sx={{
                color: '#EC2EA6',
                fontSize: '14px',
                fontFamily: '"Nobile", sans-serif',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
                '&:disabled': {
                  color: 'rgba(86, 13, 48, 0.5)',
                  cursor: 'not-allowed',
                },
              }}
            >
              {resendLoading ? (
                <CircularProgress size={16} sx={{ color: '#EC2EA6' }} />
              ) : (
                'Resend verification code'
              )}
            </Link>
          ) : (
            <Typography
              sx={{
                color: '#852654',
                fontSize: '14px',
                fontFamily: '"Nobile", sans-serif',
              }}
            >
              Resend code in {timer} seconds
            </Typography>
          )}
          
          <Typography
            sx={{
              color: '#82164A',
              fontSize: '12px',
              fontFamily: '"Nobile", sans-serif',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            Check your email (including spam folder) for the verification code.
            In production, this would be sent via email. For demo, check the server console.
          </Typography>
        </Box>
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
          onClick={() => handleSubmit()}
          disabled={loading || code.some(digit => !digit)}
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
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#FFF6F9' }} />
          ) : (
            'Verify & Continue'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default VerificationStep;