import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/sign-in');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/trade', label: 'Trade' },
    { path: '/wishlist', label: 'Wishlist' },
    { path: '/chit-chat', label: 'Chit-Chat' },
    { path: '/guide', label: 'Guide' },
  ];

  // Добавляем Admin только для администраторов
  if (user?.role === 'ADMIN') {
    navItems.push({ path: '/admin', label: 'Admin' });
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Логотип */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <img 
              src="/assets/header-logo.svg" 
              alt="Collector Mingle" 
              className="logo-image"
            />
          </Link>
        </div>

        {/* Навигация с иконкой профиля */}
        <nav className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Иконка профиля как часть навигации */}
          <Link
            to={isAuthenticated ? '/profile' : '/sign-in'}
            className="nav-link"
          >
            <img 
              src="/assets/profile-paw.svg" 
              alt="Profile" 
              className="profile-icon"
            />
          </Link>
        </nav>

        {/* Кнопки */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <div className="user-profile">
                <div className="user-avatar">
                  {user?.username?.charAt(0) || 'U'}
                </div>
                <span className="username">{user?.username}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="signin-btn">
                Sign In
              </Link>
              <Link to="/check-in" className="checkin-btn">
                Check In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;