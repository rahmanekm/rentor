import React from 'react';
import { Link } from 'react-router-dom';
import './SafetyAdvice.css';

const SafetyAdvice = () => {
  const safetyTips = [
    {
      title: "Viewing Properties",
      tips: [
        "Always view a property in person before making any payments",
        "Bring a friend or family member to viewings",
        "View properties during daylight hours",
        "Keep all communication through our platform",
        "Trust your instincts - if something feels wrong, walk away"
      ]
    },
    {
      title: "Financial Safety",
      tips: [
        "Never send money without signing a proper tenancy agreement",
        "Use secure payment methods and keep receipts",
        "Be wary of requests for unusual payment methods",
        "Ensure deposits are protected in a government-approved scheme",
        "Don't pay in cash - use bank transfers or other traceable methods"
      ]
    },
    {
      title: "Personal Information",
      tips: [
        "Protect your personal information",
        "Don't share unnecessary financial details",
        "Use strong, unique passwords for your account",
        "Be cautious with identity documents",
        "Report suspicious requests for personal information"
      ]
    },
    {
      title: "Meeting People",
      tips: [
        "Meet in public places first",
        "Share your location with friends when meeting",
        "Keep communication professional",
        "Don't share personal contact details until you're comfortable",
        "Use video calls before meeting in person when possible"
      ]
    }
  ];

  const redFlags = [
    "Requests for payment before viewing",
    "Pressure to make quick decisions",
    "Prices that seem too good to be true",
    "Requests to wire money internationally",
    "Reluctance to show proper documentation",
    "Unwillingness to meet in person",
    "Requests to move communication off-platform"
  ];

  return (
    <div className="safety-container">
      <div className="safety-hero">
        <h1>Safety First</h1>
        <p>Your safety is our top priority. Follow these guidelines for a secure experience.</p>
      </div>

      <div className="safety-content">
        <div className="safety-tips">
          {safetyTips.map((section, index) => (
            <div key={index} className="safety-section">
              <h2>{section.title}</h2>
              <ul>
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="safety-red-flags">
          <h2>Warning Signs to Watch For</h2>
          <div className="red-flags-list">
            {redFlags.map((flag, index) => (
              <div key={index} className="red-flag-item">
                <span className="red-flag-icon">⚠️</span>
                <p>{flag}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="emergency-contacts">
          <h2>Emergency Contacts</h2>
          <div className="contacts-grid">
            <div className="contact-card emergency">
              <h3>Emergency Services</h3>
              <p>Call 999</p>
              <span>For immediate danger or crime in progress</span>
            </div>
            <div className="contact-card police">
              <h3>Non-Emergency Police</h3>
              <p>Call 101</p>
              <span>For non-urgent police matters</span>
            </div>
            <div className="contact-card support">
              <h3>RoomRentor Support</h3>
              <p>Report issues through our platform</p>
              <Link to="/contact-us" className="contact-link">Contact Support</Link>
            </div>
          </div>
        </div>

        <div className="safety-resources">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <a href="https://www.gov.uk/private-renting" target="_blank" rel="noopener noreferrer" className="resource-card">
              <h3>Government Housing Guidelines</h3>
              <p>Official guidance on private renting</p>
            </a>
            <a href="https://www.citizensadvice.org.uk/housing/" target="_blank" rel="noopener noreferrer" className="resource-card">
              <h3>Citizens Advice</h3>
              <p>Free, confidential advice on housing</p>
            </a>
            <a href="https://england.shelter.org.uk/" target="_blank" rel="noopener noreferrer" className="resource-card">
              <h3>Shelter</h3>
              <p>Housing charity and advisory service</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAdvice;
