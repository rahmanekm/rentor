import React from 'react';
import './Press.css';

const Press = () => {
  const pressReleases = [
    {
      date: "May 1, 2025",
      title: "RoomRentor Reaches 50,000 Active Users",
      summary: "Leading room rental platform achieves significant milestone in user growth.",
      link: "#"
    },
    {
      date: "April 15, 2025",
      title: "RoomRentor Launches New Safety Features",
      summary: "Enhanced verification system and real-time alerts now available for all users.",
      link: "#"
    },
    {
      date: "March 20, 2025",
      title: "RoomRentor Expands to Manchester and Birmingham",
      summary: "Platform now available in two major UK cities following successful London operations.",
      link: "#"
    }
  ];

  const mediaKit = {
    downloads: [
      {
        name: "Brand Guidelines",
        description: "Logo usage, color palette, and typography guidelines",
        format: "PDF"
      },
      {
        name: "Logo Package",
        description: "High-resolution logos in various formats",
        format: "ZIP"
      },
      {
        name: "Media Photos",
        description: "High-resolution product screenshots and team photos",
        format: "ZIP"
      }
    ]
  };

  const pressContacts = {
    name: "Sarah Thompson",
    title: "Head of Communications",
    email: "press@roomrentor.com",
    phone: "+44 20 1234 5678"
  };

  return (
    <div className="press-container">
      <div className="press-hero">
        <h1>Press Room</h1>
        <p>Latest news and media resources from RoomRentor</p>
      </div>

      <div className="press-content">
        <div className="press-releases">
          <h2>Press Releases</h2>
          <div className="releases-grid">
            {pressReleases.map((release, index) => (
              <div key={index} className="release-card">
                <span className="release-date">{release.date}</span>
                <h3>{release.title}</h3>
                <p>{release.summary}</p>
                <a href={release.link} className="read-more">Read More →</a>
              </div>
            ))}
          </div>
        </div>

        <div className="media-kit">
          <h2>Media Kit</h2>
          <div className="downloads-grid">
            {mediaKit.downloads.map((item, index) => (
              <div key={index} className="download-card">
                <div className="download-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="format">{item.format}</span>
                </div>
                <button className="download-button">Download</button>
              </div>
            ))}
          </div>
        </div>

        <div className="press-contact">
          <h2>Press Contact</h2>
          <div className="contact-card">
            <h3>{pressContacts.name}</h3>
            <p>{pressContacts.title}</p>
            <div className="contact-details">
              <a href={`mailto:${pressContacts.email}`}>{pressContacts.email}</a>
              <span>{pressContacts.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
