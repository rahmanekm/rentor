import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './News.css';

const News = () => {
  const newsArticles = [
    {
      id: 1,
      title: "RoomRentor Launches Enhanced Safety Features",
      date: "May 15, 2025",
      category: "Product Update",
      excerpt: "New safety features including verified profiles and real-time alerts now available to all users.",
      image: "news-safety.jpg"
    },
    {
      id: 2,
      title: "London Housing Market Trends 2025",
      date: "May 10, 2025",
      category: "Market Analysis",
      excerpt: "Latest insights into London's rental market, featuring data from thousands of listings.",
      image: "news-market.jpg"
    },
    {
      id: 3,
      title: "Tips for International Students Finding Accommodation",
      date: "May 5, 2025",
      category: "Guides",
      excerpt: "Comprehensive guide for international students looking for accommodation in the UK.",
      image: "news-students.jpg"
    }
  ];

  const categories = [
    "All News",
    "Product Updates",
    "Market Analysis",
    "Guides",
    "Community",
    "Company News"
  ];

  return (
    <Container className="news-container">
      <h1>Latest News</h1>
      <p className="news-intro">Stay up to date with the latest updates, insights, and stories from RoomRentor.</p>

      <Row className="news-content">
        <Col md={8}>
          {newsArticles.map((article) => (
            <Card key={article.id} className="news-card">
              <Card.Body>
                <div className="news-meta">
                  <span className="news-category">{article.category}</span>
                  <span className="news-date">{article.date}</span>
                </div>
                <h2>{article.title.trim()}</h2>
                <p>{article.excerpt}</p>
                <Link to={`/news/${article.id}`} className="read-more">
                  Read More →
                </Link>
              </Card.Body>
            </Card>
          ))}
        </Col>
        
        <Col md={4}>
          <div className="news-sidebar">
            <h3>Categories</h3>
            <ul className="news-categories">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link to={`/news/category/${category.toLowerCase().replace(' ', '-')}`}>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="news-subscribe">
              <h3>Stay Updated</h3>
              <p>Get the latest news and updates delivered to your inbox.</p>
              <form className="subscribe-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default News;
