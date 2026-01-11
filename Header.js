import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
  if (isMenuOpen) {
    document.body.classList.add('menu-open');
  } else {
    document.body.classList.remove('menu-open');
  }
  return () => document.body.classList.remove('menu-open');
}, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/sign-in');
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/trade', label: 'Trade' },
    { path: '/wishlist', label: 'Wishlist' },
    { path: '/chit-chat', label: 'Chit-Chat' },
    { path: '/guide', label: 'Guide' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ path: '/admin', label: 'Admin' });
  }

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Логотип */}
        <div className="header-logo">
          <Link to="/" className="header-logo-link">
            <img 
              src="/assets/header-logo.png" 
              alt="Collector Mingle" 
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-c">C</span>
              <span className="logo-m">M</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav-desktop">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`header-nav-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions-desktop">
          {isAuthenticated ? (
            <>
              <button className="notification-btn">
                <Bell size={24} />
                <span className="notification-badge">3</span>
              </button>
              <Link to="/profile" className="profile-btn">
                <div className="profile-avatar">
                  <User size={20} />
                </div>
                <span className="profile-username">{user?.username}</span>
              </Link>
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

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
        )}

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <img 
              src="/assets/header-logo.png" 
              alt="Collector Mingle" 
              className="mobile-logo"
            />
            <span className="mobile-logo-text">Collector Mingle</span>
          </div>
          
          <nav className="mobile-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-actions">
            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="mobile-username">{user?.username}</div>
                    <div className="mobile-user-email">{user?.email}</div>
                  </div>
                </div>
                <Link 
                  to="/profile" 
                  className="mobile-profile-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  to="/notifications" 
                  className="mobile-notifications-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bell size={20} />
                  Notifications
                  <span className="mobile-badge">3</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="mobile-logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/sign-in" 
                  className="mobile-signin-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/check-in" 
                  className="mobile-checkin-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Check In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;