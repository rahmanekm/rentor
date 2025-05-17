import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="hero-section">
        <h1>About RoomRentor</h1>
        <p>Connecting people with their perfect living spaces since 2023</p>
      </div>

      <div className="content-section">
        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            At RoomRentor, we're dedicated to making the process of finding rooms
            and flatmates as simple and stress-free as possible. We believe that
            everyone deserves a place they can call home, and we're here to help
            make that happen.
          </p>
        </div>

        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Trust</h3>
              <p>Building a community based on transparency and reliability</p>
            </div>
            <div className="value-card">
              <h3>Safety</h3>
              <p>Prioritizing user safety and security in every interaction</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Continuously improving our platform for better user experience</p>
            </div>
            <div className="value-card">
              <h3>Community</h3>
              <p>Fostering connections and building lasting relationships</p>
            </div>
          </div>
        </div>        <div className="team-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, RoomRentor emerged from a simple idea: make room
            hunting and flatmate finding easier for everyone. What started as a
            small project has grown into a trusted platform serving thousands of
            users across the United Kingdom.
          </p>
          <p>
            Our team of dedicated professionals works tirelessly to ensure that
            RoomRentor remains the most reliable and user-friendly platform for
            finding your next home or flatmate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
