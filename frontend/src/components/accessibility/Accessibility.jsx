import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Accessibility.css';

const Accessibility = () => {
  return (
    <Container className="accessibility-container">
      <h1>Accessibility Statement</h1>
      <p className="accessibility-intro">
        RoomRentor is committed to ensuring digital accessibility for people with disabilities. We continually work to improve the user experience for everyone and apply the relevant accessibility standards.
      </p>

      <section className="accessibility-section">
        <h2>Our Commitment</h2>
        <p>
          We strive to ensure that our website is accessible to all users regardless of technology or ability. We aim to comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
        </p>
      </section>

      <section className="accessibility-section">
        <h2>Key Features</h2>
        <Row>
          <Col md={6}>
            <Card className="accessibility-card">
              <Card.Body>
                <h3>Navigation</h3>
                <ul>
                  <li>Clear navigation menus</li>
                  <li>Consistent layout across pages</li>
                  <li>Logical heading structure</li>
                  <li>Skip navigation links</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="accessibility-card">
              <Card.Body>
                <h3>Visual Design</h3>
                <ul>
                  <li>High contrast text</li>
                  <li>Resizable text</li>
                  <li>Alt text for images</li>
                  <li>Clear focus indicators</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="accessibility-section">
        <h2>Assistive Technology</h2>
        <p>Our website is designed to be compatible with:</p>
        <ul>
          <li>Screen readers</li>
          <li>Speech recognition software</li>
          <li>Screen magnifiers</li>
          <li>Keyboard navigation</li>
        </ul>
      </section>

      <section className="accessibility-section">
        <h2>Contact Us</h2>
        <p>
          If you have specific questions or concerns about the accessibility of our website, please contact us through our{' '}
          <a href="/contact-us" className="accessibility-link">contact form</a>. We welcome your feedback and will strive to address any accessibility barriers you identify.
        </p>
      </section>
    </Container>
  );
};

export default Accessibility;
