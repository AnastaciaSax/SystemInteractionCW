import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const pages = [
    { path: '/', label: 'Home' },
    { path: '/trade', label: 'Trade' },
    { path: '/wishlist', label: 'Wishlist' },
    { path: '/chit-chat', label: 'Chit-Chat' },
    { path: '/guide', label: 'Guide' },
  ];

  const socialMedia = [
    { name: 'Discord', icon: '💬', url: '#' },
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'YouTube', icon: '▶️', url: '#' },
    { name: 'Pinterest', icon: '📌', url: '#' },
    { name: 'Instagram', icon: '📸', url: '#' },
  ];

  const contacts = [
    { icon: <MapPin size={20} />, text: '2456 Sunset Blvd.\nLos Angeles, CA 90026, USA' },
    { icon: <Mail size={20} />, text: 'collector.mingle@gmail.com' },
    { icon: <Phone size={20} />, text: '(323) 555-2147' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo & Tagline */}
          <div className="footer-section footer-logo-section">
            <div className="footer-logo">
              <img 
                src="/assets/logo-footer.svg" 
                alt="Collector Mingle" 
                className="footer-logo-image"
              />
              <div className="footer-brand">
                <span className="footer-brand-text">Collector Mingle</span>
                <p className="footer-tagline">
                  "Expand your Little World with us"
                </p>
              </div>
            </div>
          </div>

          {/* Pages */}
          <div className="footer-section">
            <h4 className="footer-heading">Pages</h4>
            <ul className="footer-links">
              {pages.map((page) => (
                <li key={page.path}>
                  <Link to={page.path} className="footer-link">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4 className="footer-heading">Social Media</h4>
            <ul className="footer-links">
              {socialMedia.map((social) => (
                <li key={social.name}>
                  <a 
                    href={social.url} 
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="social-icon">{social.icon}</span>
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section footer-contact-section">
            <h4 className="footer-heading">Contact</h4>
            <div className="contact-info">
              {contacts.map((contact, index) => (
                <div key={index} className="contact-item">
                  <div className="contact-icon">{contact.icon}</div>
                  <span className="contact-text">{contact.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright © {currentYear} Collector Mingle | Designed with{' '}
            <Heart size={16} className="heart-icon" /> by Anastacia Sax
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;