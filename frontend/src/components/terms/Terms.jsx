import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-hero">
        <h1>Terms & Conditions</h1>
        <p>Last updated: May 14, 2025</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using RoomRentor's services, you agree to be bound by these Terms and Conditions.
            These terms apply to all visitors, users, and others who access or use our service.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information.
            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Content Guidelines</h2>
          <p>
            Users are responsible for all content they post on RoomRentor. Content must be accurate,
            legal, and not violate any third-party rights. We reserve the right to remove any content
            that violates these terms.
          </p>
          <ul>
            <li>All listings must be for real properties</li>
            <li>Images must be actual photos of the property</li>
            <li>Pricing information must be accurate</li>
            <li>No discriminatory content or requirements</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Safety and Security</h2>
          <p>
            While we strive to ensure the safety of our platform, users are responsible for their
            own safety when meeting other users or viewing properties. We recommend following our
            safety guidelines at all times.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Payments and Fees</h2>
          <p>
            All payments must be made through our secure platform. We are not responsible for any
            payments made outside our system. Service fees are non-refundable unless otherwise stated.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability,
            for any reason, including breach of these Terms & Conditions.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any
            material changes via email or through our platform.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms & Conditions, please contact us at:
            <a href="mailto:legal@roomrentor.com">legal@roomrentor.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
