import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#A50050',
      light: '#EC2EA6',
      dark: '#560D30',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#96F2F7',
      light: '#F6C4D4',
      dark: '#82164A',
      contrastText: '#560D30',
    },
    background: {
      default: '#F8FFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#560D30',
      secondary: '#82164A',
    },
    error: {
      main: '#FF4C4C',
    },
    warning: {
      main: '#FFC107',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: '"Nobile", sans-serif',
    h1: {
      fontFamily: '"Rammetto One", cursive',
      fontSize: '56px',
      color: '#560D30',
      '@media (max-width:768px)': {
        fontSize: '42px',
      },
    },
    h2: {
      fontFamily: '"McLaren", cursive',
      fontSize: '48px',
      color: '#560D30',
      '@media (max-width:768px)': {
        fontSize: '36px',
      },
    },
    h3: {
      fontSize: '32px',
      color: '#82164A',
      fontWeight: 700,
    },
    h4: {
      fontSize: '24px',
      color: '#82164A',
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
      color: '#82164A',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontFamily: '"Nobile", sans-serif',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontFamily: '"Nobile", sans-serif',
          fontWeight: 500,
          fontSize: '16px',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          backgroundColor: '#A50050',
          '&:hover': {
            backgroundColor: '#EC2EA6',
          },
        },
        outlinedPrimary: {
          borderColor: '#A50050',
          color: '#A50050',
          '&:hover': {
            borderColor: '#EC2EA6',
            backgroundColor: 'rgba(165, 0, 80, 0.05)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width:1200px)': {
            maxWidth: '1400px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
});

export default theme;