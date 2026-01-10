import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import Home from './pages/Home/Home';
import Trade from './pages/Trade/Trade';
import Wishlist from './pages/Wishlist/Wishlist';
import Chat from './pages/Chit-chat/Chat';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Register from './pages/Check-in/Register';
import Login from './pages/Sign-in/Login';
import Guide from './pages/Guide/Guide';

// Context
import { AuthProvider } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/chit-chat" element={<Chat />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/check-in" element={<Register />} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;