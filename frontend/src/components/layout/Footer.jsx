import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="social-icon-svg">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
  const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="social-icon-svg">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
  );
  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon-svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  return (
    <footer className="footer-spareroom">
      <div className="footer-container-spareroom">
        <div className="footer-column-spareroom">
          <h4>RoomRentor</h4>
          <ul>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div className="footer-column-spareroom">
          <h4>Help & Info</h4>
          <ul>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/safety">Safety Advice</Link></li>
            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-column-spareroom">
          <h4>For Advertisers</h4>
          <ul>
            <li><Link to="/post-ad-info">Post an Ad</Link></li>
            <li><Link to="/advertiser-tips">Advertiser Tips</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div className="footer-column-spareroom footer-social-spareroom">
          <h4>Follow Us</h4>
          <div className="social-links-spareroom">
            {/* Using placeholder links for social media */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><TwitterIcon /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
          </div>
          <div className="app-stores-spareroom">
            {/* Using placeholder links for app stores */}
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="app-store-button-spareroom">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-store-icon-spareroom">
                <path d="M12 15V3m0 12l-4-4m4 4l4-4"/>
                <path d="M2 17h20"/>
              </svg>
              <span>Download on the App Store</span>
            </a>
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="app-store-button-spareroom">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="app-store-icon-spareroom">
                <path d="M6 4l12 8-12 8V4z"/>
              </svg>
              <span>Get it on Google Play</span>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom-spareroom">
        <p>&copy; {new Date().getFullYear()} RoomRentor. All rights reserved. </p>
      </div>
    </footer>
  );
};

export default Footer;
