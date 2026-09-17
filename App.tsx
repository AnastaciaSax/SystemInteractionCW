// Collector Mingle
// Copyright (C) 2025 Anastacia Sax
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import PageTransitionLoader from './components/ui/PageTransitionLoader';
import { AuthProvider } from './context/AuthContext'; 
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
         <AuthProvider>
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
                </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
