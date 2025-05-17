import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sitemap.css';

const Sitemap = () => {
  const sitemapData = [
    {
      title: "Find & List",
      links: [
        { to: "/rooms", text: "Find a Room" },
        { to: "/flatmates", text: "Find Flatmates" },
        { to: "/post-ad", text: "List Your Room" },
        { to: "/my-flatmate-profile", text: "Create Flatmate Profile" }
      ]
    },
    {
      title: "About Us",
      links: [
        { to: "/about-us", text: "About RoomRentor" },
        { to: "/careers", text: "Careers" },
        { to: "/press", text: "Press" },
        { to: "/blog", text: "Blog" }
      ]
    },
    {
      title: "Help & Support",
      links: [
        { to: "/contact-us", text: "Contact Us" },
        { to: "/faq", text: "FAQs" },
        { to: "/safety", text: "Safety Guide" },
        { to: "/advice", text: "Renting Advice" }
      ]
    },
    {
      title: "Resources",
      links: [
        { to: "/news", text: "Latest News" },
        { to: "/advertiser-tips", text: "Tips for Success" },
        { to: "/pricing", text: "Pricing Plans" }
      ]
    },
    {
      title: "Legal",
      links: [
        { to: "/terms-conditions", text: "Terms & Conditions" },
        { to: "/privacy-policy", text: "Privacy Policy" },
        { to: "/accessibility", text: "Accessibility" }
      ]
    }
  ];

  return (
    <Container className="sitemap-container">
      <h1>Sitemap</h1>
      <p className="sitemap-intro">Find everything you need on RoomRentor with our comprehensive site directory.</p>
      
      <Row className="sitemap-content">
        {sitemapData.map((section, index) => (
          <Col key={index} md={4} className="sitemap-section">
            <h2>{section.title}</h2>
            <ul>
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link to={link.to}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Sitemap;
