import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For now, we'll just show a success message
    toast.success('Thank you for your message. We\'ll get back to you soon!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We're here to help and answer any question you might have</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Our Location</h3>
              <address>
                123 RoomRentor Street
                London, EC1A 1BB
                United Kingdom
              </address>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone Number</h3>
              <p>+44 20 1234 5678</p>
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email Address</h3>
              <p>support@roomrentor.com</p>
              <span>For general inquiries</span>
              <span>Response within 24h</span>
            </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this regarding?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your message"
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>How do I list my room?</h3>
            <p>Click on "List Your Room" in the navigation bar and follow the simple steps to create your listing.</p>
          </div>
          <div className="faq-card">
            <h3>Is it free to use RoomRentor?</h3>
            <p>Basic listings are free. Check our pricing page for premium features and enhanced visibility options.</p>
          </div>
          <div className="faq-card">
            <h3>How do I report an issue?</h3>
            <p>Use the contact form above or email us directly at support@roomrentor.com with details of your concern.</p>
          </div>
          <div className="faq-card">
            <h3>What areas do you cover?</h3>
            <p>We currently operate throughout the United Kingdom, with a focus on major cities and surrounding areas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
