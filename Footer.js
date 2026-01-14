import React from 'react';
import { Link } from 'react-router-dom';
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
    { name: 'Discord', url: '#' },
    { name: 'Facebook', url: '#' },
    { name: 'YouTube', url: '#' },
    { name: 'Pinterest', url: '#' },
    { name: 'Instagram', url: '#' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Логотип и тэглайн */}
          <div className="footer-logo-section">
            <div className="logo-wrapper">
              <img 
                src="/assets/logo-footer.svg" 
                alt="Collector Mingle" 
                className="footer-logo"
              />
              <div className="tagline">
                "Expand your Little World with us"
              </div>
            </div>
          </div>

          {/* Колонки */}
          <div className="footer-columns">
            {/* Pages */}
            <div className="footer-column pages-column">
              <h3 className="column-title">Pages</h3>
              <div className="column-links">
                {pages.map((page) => (
                  <Link key={page.path} to={page.path} className="page-link">
                    {page.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="footer-column social-column">
              <h3 className="column-title">Social media</h3>
              <div className="column-links">
                {socialMedia.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.url} 
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="footer-column contact-column">
              <h3 className="column-title">Contact</h3>
              <div className="contact-info">
                <div className="contact-item">
                  2456 Sunset Blvd.<br />Los Angeles, CA 90026, USA
                </div>
                <div className="contact-item">
                  collector.mingle@gmail.com
                </div>
                <div className="contact-item">
                  (323) 555-2147
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="footer-divider" />

        {/* Копирайт */}
        <div className="footer-bottom">
          <div className="copyright">
            Copyright © {currentYear} Collector Mingle | Designed by Anastacia Sax
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;