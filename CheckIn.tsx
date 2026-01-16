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

// Моковые функции для API (замените реальными)
const mockResendCode = async (email: string) => {
  console.log(`[MOCK] Verification code sent to: ${email}`);
  console.log(`[MOCK] Code: 123456 (for demo purposes)`);
  return { success: true, message: 'Verification code sent successfully' };
};

const mockVerifyCode = async (code: string) => {
  console.log(`[MOCK] Verifying code: ${code}`);
  // В реальном приложении здесь будет запрос к серверу
  if (code === '123456') {
    return { success: true, message: 'Email verified successfully' };
  }
  return { success: false, message: 'Invalid verification code' };
};

const CheckIn: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    mode: 'SIMPLE' as 'SIMPLE' | 'PARENTAL',
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

  const handleModeSelect = (mode: 'SIMPLE' | 'PARENTAL') => {
    setFormData(prev => ({ ...prev, mode }));
    setCurrentStep(2);
  };

  const handleInfoSubmit = (userData: any) => {
    setFormData(prev => ({ ...prev, userData, verificationEmail: userData.email }));
    setCurrentStep(3);
    
    // Отправляем код верификации
    mockResendCode(userData.email);
  };

  const handleVerificationNext = () => {
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResendCode = async () => {
    const result = await mockResendCode(formData.verificationEmail);
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Verification code resent successfully',
        severity: 'success',
      });
    }
    return result;
  };

  const handleVerifyCode = async (code: string) => {
    const result = await mockVerifyCode(code);
    return result;
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