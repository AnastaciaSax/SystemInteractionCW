import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import PageTransitionLoader from './components/ui/PageTransitionLoader';
import './App.css';

// Ленивая загрузка всех страниц
const Home = lazy(() => import('./pages/Home/Home'));
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
const CheckIn = lazy(() => import('./pages/CheckIn/CheckIn'));
const Trade = lazy(() => import('./pages/Trade/Trade'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const Guide = lazy(() => import('./pages/Guide/Guide'));
const ChitChat = lazy(() => import('./pages/ChitChat/ChitChat'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<PageTransitionLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/chit-chat" element={<ChitChat />} />
            <Route path="/guide" element={<Guide />} />
           <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;