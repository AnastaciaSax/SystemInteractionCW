// src/pages/CheckIn/CheckIn.tsx
import React, { useState } from 'react';
import { Box, Container, Alert, Snackbar } from '@mui/material';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PageBanner from '../../components/PageBanner';
import StepIndicator from '../../components/StepIndicator';
import ModeStep from './components/ModeStep';
import InfoStep from './components/InfoStep';
import VerificationStep from './components/VerificationStep';
import SubmitStep from './components/SubmitStep';
import { authAPI } from '../../services/api';

const CheckIn: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    mode: 'SIMPLE' as 'SIMPLE' | 'ADMIN',
    userData: {} as any,
    verificationEmail: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const steps = [
    { number: 1, label: 'Mode' },
    { number: 2, label: 'Info' },
    { number: 3, label: 'Verification' },
    { number: 4, label: 'Submit' },
  ];

  const handleModeSelect = (mode: 'SIMPLE' | 'ADMIN') => {
    setFormData(prev => ({ ...prev, mode }));
    setCurrentStep(2);
  };

const handleInfoSubmit = (userData: any) => {
  setFormData(prev => ({ 
    ...prev, 
    userData, 
    verificationEmail: userData.email 
  }));
  setCurrentStep(3);
};

  const handleVerificationNext = () => {
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResendCode = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await authAPI.sendVerification(formData.verificationEmail);
    if (result.data.success) {
      setSnackbar({
        open: true,
        message: result.data.message || 'Verification code sent successfully',
        severity: 'success',
      });
      // Гарантируем возврат объекта с правильной структурой
      return {
        success: true,
        message: result.data.message || 'Verification code sent successfully'
      };
    }
    // Если success: false
    const errorMessage = result.data.message || 'Failed to send verification code';
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error',
    });
    return {
      success: false,
      message: errorMessage
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'Failed to send verification code';
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error',
    });
    // Возвращаем объект с ошибкой вместо throw
    return {
      success: false,
      message: errorMessage
    };
  }
};

  const handleVerifyCode = async (code: string): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await authAPI.verifyCode(formData.verificationEmail, code);
    return result.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 
              error.response?.data?.error || 
              error.message || 
              'Verification failed',
    };
  }
};

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ModeStep
            onNext={handleModeSelect}
            onBack={() => window.history.back()}
            initialMode={formData.mode}
          />
        );
      case 2:
        return (
          <InfoStep
            onNext={handleInfoSubmit}
            onBack={handleBack}
            initialData={formData.userData}
          />
        );
      case 3:
        return (
          <VerificationStep
            onNext={handleVerificationNext}
            onBack={handleBack}
            email={formData.verificationEmail}
            onResendCode={handleResendCode}
            onVerifyCode={handleVerifyCode}
          />
        );
      case 4:
        return (
          <SubmitStep
            onBack={handleBack}
            userData={formData.userData}
            mode={formData.mode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #FFF1F8 0%, #E9C4D9 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <PageBanner
        title="Check In"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Check In' },
        ]}
      />

      <Container
        sx={{
          maxWidth: '1280px !important',
          py: { xs: 4, sm: 6, md: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StepIndicator currentStep={currentStep} steps={steps} />
        {renderStep()}
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckIn;