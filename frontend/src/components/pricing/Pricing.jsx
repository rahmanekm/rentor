import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../../context/AuthContext';
import './pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added useLocation hook
  const { isAuthenticated, currentUser } = useAuth(); // Assuming currentUser contains the user's plan

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) {
      // Use location.pathname to redirect back to pricing after login
      navigate('/login', { state: { from: location.pathname, message: "Please log in to subscribe to a plan." } });
    } else {
      let paymentUrl = '';
      if (plan === 'Premium') {
        paymentUrl = 'https://revolut.me/r/d77YAVbW0i';
      } else if (plan === 'Professional') {
        paymentUrl = 'https://revolut.me/r/AZ8ov0tl2H';
      }

      if (paymentUrl) {
        window.open(paymentUrl, '_blank'); // Open link in a new tab
      } else {
        // Handle case for Free plan if needed (button is disabled)
        console.log('Attempted to "subscribe" to Free plan - button should be disabled.');
      }
    }
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Choose the Right Plan for Your Needs</h1>
        <p>Whether you're a landlord looking to list multiple properties or a tenant searching for your perfect home, we have a plan that fits your requirements.</p>
      </div>

      <div className="pricing-cards">
        <div className={`pricing-card ${currentUser?.plan === 'Free' ? 'active-plan' : ''}`}> {/* Added class for active plan */}
          <div className="pricing-card-header">
            <h2>Basic</h2>
             {currentUser?.plan === 'Free' && <span className="active-tag">Current Plan</span>} {/* Active tag */}
            <div className="price">
              <span className="currency">£</span>
              <span className="amount">0</span>
              <span className="period">/month</span>
            </div>
          </div>
          <div className="pricing-card-body">
            <ul className="features-list">
              <li>List 1 room FREE forever</li>
              <li>Basic search functionality</li>
              <li>Email notifications</li>
              <li>2 Free Messages</li>
              <li>Upgrade to Unlimited Messages for £5/month</li>
              <li>Standard customer support</li>
            </ul>
            {currentUser?.plan === 'Free' ? (
              <Button variant="secondary" className="subscribe-button" disabled>
                Activated
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="subscribe-button"
                disabled={currentUser?.plan === 'Free'}
                onClick={() => handleSubscribe('Basic')} // This button should ideally not trigger handleSubscribe in this flow
              >
                {isAuthenticated ? "Activated" : "Get Started Free"}
              </Button>
            )}
          </div>
        </div>

        <div className="pricing-card featured">
          <div className="pricing-card-header">
            <div className="popular-tag">Most Popular</div>
            <h2>Premium</h2>
            <div className="price">
              <span className="currency">£</span>
              <span className="amount">19.99</span>
              <span className="period">/month</span>
            </div>
          </div>
          <div className="pricing-card-body">
            <ul className="features-list">
              <li>List up to 5 rooms with no time limit</li>
              <li>Featured listings in search results</li>
              <li>Unlimited search functionality</li>
              <li>Instant messaging with potential tenants</li>
              <li>Priority customer support</li>
              <li>Detailed analytics on listing views</li>
            </ul>
            <Button 
              variant="primary" 
              className="subscribe-button"
              onClick={() => handleSubscribe('Premium')} // This will now open the Revolut link
            >
              Subscribe Now
            </Button>
          </div>
        </div>

        <div className="pricing-card">
          <div className="pricing-card-header">
            <h2>Professional</h2>
            <div className="price">
              <span className="currency">£</span>
              <span className="currency">£</span>
              <span className="amount">49.99</span>
              <span className="period">/month</span>
            </div>
          </div>
          <div className="pricing-card-body">
            <ul className="features-list">
              <li>Unlimited room listings</li>
              <li>Top placement in search results</li>
              <li>All Premium features included</li>
              <li>Bulk upload of properties</li>
              <li>Dedicated account manager</li>
              <li>Dedicated success manager</li>
              <li>Custom branding options</li>
            </ul>
            <Button 
              variant="primary" 
              className="subscribe-button"
              onClick={() => handleSubscribe('Professional')} // This will now open the Revolut link
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>

      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-item">
          <h3>Can I upgrade or downgrade my plan?</h3>
          <p>Yes, you can change your plan at any time. Changes will take effect at the start of your next billing cycle.</p>
        </div>
        
        <div className="faq-item">
          <h3>Is there a contract or commitment?</h3>
          <p>No, all our plans are month-to-month with no long-term commitment. You can cancel anytime.</p>
        </div>
        
        <div className="faq-item">
          <h3>Do you offer discounts for annual subscriptions?</h3>
          <p>Yes, we offer a 20% discount when you pay annually for any of our paid plans.</p>
        </div>
        
        <div className="faq-item">
          <h3>What payment methods do you accept?</h3>
          <p>We accept all major credit cards, PayPal, and direct bank transfers for Professional plans.</p>
        </div>
      </div>

      <div className="pricing-cta">
        <h2>Not sure which plan is right for you?</h2>
        <p>Our team is here to help you choose the best option for your needs.</p>
        <Button 
          variant="outline-primary" 
          className="contact-button"
          onClick={() => navigate('/contact-us')}
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
