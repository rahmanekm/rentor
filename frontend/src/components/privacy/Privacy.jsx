import React from 'react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: May 14, 2025</p>
      </div>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2>1. Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li>Name and contact information</li>
            <li>Account login details</li>
            <li>Profile information</li>
            <li>Payment information</li>
          </ul>
          <h3>Usage Information</h3>
          <ul>
            <li>Browser and device information</li>
            <li>IP address and location data</li>
            <li>Cookies and similar technologies</li>
            <li>Usage patterns and preferences</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Process your transactions</li>
            <li>Communicate with you</li>
            <li>Ensure platform safety and security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Other users (as necessary for bookings and communications)</li>
            <li>Service providers and partners</li>
            <li>Legal authorities (when required by law)</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect
            your personal information. However, no method of transmission over the
            Internet is 100% secure.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>6. Cookies Policy</h2>
          <p>
            We use cookies and similar tracking technologies to improve your
            browsing experience, analyze site traffic, and understand where our
            visitors come from.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not intended for users under 18. We do not knowingly
            collect information from children under 18.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Changes to Privacy Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of any
            changes by posting the new policy on this page and updating the "Last
            updated" date.
          </p>
        </section>

        <section className="privacy-section">
          <h2>9. Contact Us</h2>
          <p>
            For questions about this Privacy Policy, please contact our Data Protection Officer at:
            <a href="mailto:privacy@roomrentor.com">privacy@roomrentor.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
