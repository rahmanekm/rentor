import React from 'react';
import './Careers.css';

const Careers = () => {
  const departments = [
    {
      name: "Engineering",
      positions: [
        {
          title: "Senior Full Stack Developer",
          type: "Full-time",
          location: "London / Remote",
          description: "Join our core engineering team to build and scale our platform."
        },
        {
          title: "DevOps Engineer",
          type: "Full-time",
          location: "Remote",
          description: "Help us build and maintain our cloud infrastructure."
        }
      ]
    },
    {
      name: "Product & Design",
      positions: [
        {
          title: "UX/UI Designer",
          type: "Full-time",
          location: "London",
          description: "Create beautiful and intuitive user experiences for our platform."
        },
        {
          title: "Product Manager",
          type: "Full-time",
          location: "London / Remote",
          description: "Drive product strategy and execution."
        }
      ]
    },
    {
      name: "Marketing & Growth",
      positions: [
        {
          title: "Digital Marketing Manager",
          type: "Full-time",
          location: "London",
          description: "Lead our digital marketing initiatives and growth strategies."
        },
        {
          title: "Content Marketing Specialist",
          type: "Full-time",
          location: "Remote",
          description: "Create engaging content for our blog and social media."
        }
      ]
    }
  ];

  return (
    <div className="careers-container">
      <div className="careers-hero">
        <h1>Join Our Team</h1>
        <p>Help us transform the way people find their perfect living space</p>
      </div>

      <div className="careers-content">
        <div className="company-mission">
          <h2>Why RoomRentor?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Innovation</h3>
              <p>Work on cutting-edge technology and shape the future of housing</p>
            </div>
            <div className="benefit-card">
              <h3>Growth</h3>
              <p>Rapid career progression and learning opportunities</p>
            </div>
            <div className="benefit-card">
              <h3>Culture</h3>
              <p>Inclusive, supportive, and dynamic work environment</p>
            </div>
            <div className="benefit-card">
              <h3>Benefits</h3>
              <p>Competitive salary, equity, and comprehensive benefits package</p>
            </div>
          </div>
        </div>

        <div className="open-positions">
          <h2>Open Positions</h2>
          <p>We currently do not have any open positions. However, we are always looking for talented individuals to join our team. Please check back soon for updates.</p>
        </div>

        <div className="not-found-position">
          <h2>Don't see the right position?</h2>
          <p>We're always looking for talented people to join our team.</p>
          <a href="mailto:careers@roomrentor.com" className="contact-button">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Careers;
