
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import CheckIn from './pages/CheckIn/CheckIn';
import Trade from './pages/Trade/Trade';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Guide from './pages/Guide/Guide';
import ChitChat from './pages/ChitChat/ChitChat';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/chit-chat" element={<ChitChat />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;