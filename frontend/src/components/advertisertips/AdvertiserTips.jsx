import React from 'react';
import './AdvertiserTips.css';

const AdvertiserTips = () => {
  const tipsCategories = [
    {
      title: "Creating Great Listings",
      tips: [
        {
          heading: "High-Quality Photos",
          content: "Take well-lit photos during daylight hours. Include pictures of all rooms, common areas, and exterior views.",
          icon: "📸"
        },
        {
          heading: "Detailed Description",
          content: "Provide comprehensive information about amenities, room sizes, and nearby facilities.",
          icon: "📝"
        },
        {
          heading: "Accurate Pricing",
          content: "Be clear about rent, deposits, and any additional fees or bills included.",
          icon: "💰"
        },
        {
          heading: "Location Details",
          content: "Include information about transport links, local amenities, and neighborhood features.",
          icon: "📍"
        }
      ]
    },
    {
      title: "Managing Inquiries",
      tips: [
        {
          heading: "Quick Responses",
          content: "Respond to messages promptly to maintain engagement with potential tenants.",
          icon: "⚡"
        },
        {
          heading: "Professional Communication",
          content: "Keep communications clear, professional, and within the platform.",
          icon: "💬"
        },
        {
          heading: "Organized Viewings",
          content: "Schedule viewings efficiently and maintain a calendar of appointments.",
          icon: "📅"
        },
        {
          heading: "Safety First",
          content: "Follow our safety guidelines when meeting potential tenants.",
          icon: "🛡️"
        }
      ]
    },
    {
      title: "Successful Rentals",
      tips: [
        {
          heading: "Proper Documentation",
          content: "Have all necessary documents ready, including contracts and property certificates.",
          icon: "📄"
        },
        {
          heading: "Fair Screening",
          content: "Use consistent and fair criteria when screening potential tenants.",
          icon: "✅"
        },
        {
          heading: "Clear Terms",
          content: "Be transparent about rules, expectations, and rental terms.",
          icon: "📋"
        },
        {
          heading: "Regular Updates",
          content: "Keep your listing current and mark it as rented when no longer available.",
          icon: "🔄"
        }
      ]
    }
  ];

  return (
    <div className="advertiser-tips-container">
      <div className="advertiser-tips-hero">
        <h1>Tips for Successful Advertising</h1>
        <p>Make your listings stand out and find the perfect tenants</p>
      </div>

      <div className="advertiser-tips-content">
        {tipsCategories.map((category, index) => (
          <section key={index} className="tips-section">
            <h2>{category.title}</h2>
            <div className="tips-grid">
              {category.tips.map((tip, tipIndex) => (
                <div key={tipIndex} className="tip-card">
                  <span className="tip-icon">{tip.icon}</span>
                  <h3>{tip.heading}</h3>
                  <p>{tip.content}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="tips-resources">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <a href="/pricing" className="resource-card">
              <h3>Pricing Guide</h3>
              <p>Learn about our advertising packages and pricing</p>
            </a>
            <a href="/safety-advice" className="resource-card">
              <h3>Safety Guidelines</h3>
              <p>Important safety tips for property viewings</p>
            </a>
            <a href="/contact-us" className="resource-card">
              <h3>Support</h3>
              <p>Get help from our dedicated support team</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdvertiserTips;
