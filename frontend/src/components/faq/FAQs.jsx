import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQs.css';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqSections = [
    {
      title: 'For Tenants',
      questions: [
        {
          q: 'How do I search for rooms?',
          a: 'Use our search bar on the homepage to find rooms in your desired location. You can filter by price, room type, and other preferences to find your perfect match.'
        },
        {
          q: 'Is it free to use RoomRentor?',
          a: 'Yes, searching for rooms and contacting advertisers is completely free for tenants.'
        },
        {
          q: 'How do I contact a landlord?',
          a: 'Once you find a room you\'re interested in, click the "Contact" button on the listing. You\'ll need to be logged in to send messages.'
        },
        {
          q: 'Are the rooms verified?',
          a: 'While we encourage landlords to provide accurate information, we recommend always viewing a room in person before making any payments.'
        }
      ]
    },
    {
      title: 'For Landlords',
      questions: [
        {
          q: 'How do I list my room?',
          a: 'Click "List Your Room" in the navigation bar, create an account if you haven\'t already, and follow our simple listing process.'
        },
        {
          q: 'What are the fees for listing?',
          a: 'Basic listings are free. Premium features are available for enhanced visibility. Check our pricing page for details.'
        },
        {
          q: 'How long does my listing stay active?',
          a: 'Standard listings remain active for 30 days. You can renew, edit, or remove your listing at any time.'
        },
        {
          q: 'Can I edit my listing after posting?',
          a: 'Yes, you can edit your listing at any time through your dashboard.'
        }
      ]
    },
    {
      title: 'Safety & Security',
      questions: [
        {
          q: 'How do you verify users?',
          a: 'We use email verification and encourage users to complete their profiles. For additional security, we recommend following our safety guidelines.'
        },
        {
          q: 'What should I do if I spot suspicious activity?',
          a: 'Use the "Report" button on any listing or profile, or contact our support team immediately.'
        },
        {
          q: 'Are deposits protected?',
          a: 'We recommend using government-approved deposit protection schemes and always getting proper documentation.'
        }
      ]
    },
    {
      title: 'Account & Technical',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click "Login", then "Forgot Password" and follow the instructions sent to your email.'
        },
        {
          q: 'Can I have multiple listings?',
          a: 'Yes, landlords can manage multiple listings from a single account.'
        },
        {
          q: 'How do I delete my account?',
          a: 'Go to your account settings and select "Delete Account". Note that this action is permanent.'
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to the most common questions about RoomRentor</p>
      </div>

      <div className="faq-content">
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="faq-section">
            <h2>{section.title}</h2>
            <div className="faq-questions">
              {section.questions.map((item, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeIndex === sectionIndex * 10 + index ? 'active' : ''}`}
                >
                  <button 
                    className="faq-question"
                    onClick={() => toggleAccordion(sectionIndex * 10 + index)}
                  >
                    {item.q}
                    <span className="faq-icon">
                      {activeIndex === sectionIndex * 10 + index ? '−' : '+'}
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="faq-contact">
        <h2>Still Have Questions?</h2>
        <p>Can't find the answer you're looking for? We're here to help!</p>
        <div className="faq-buttons">
          <Link to="/contact-us" className="contact-button">Contact Support</Link>
          <Link to="/safety" className="safety-button">Safety Guidelines</Link>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
