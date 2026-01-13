import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import Home from './pages/Home/Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={
              <Home />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;