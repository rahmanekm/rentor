import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './BlogPage.css';
import { blogPosts } from '../../data/blogData'; // Import blog data

const BlogPage = () => {
  return (
    <Container className="blog-page-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1>RoomRentor Blog</h1>
          <p className="lead text-center mb-5">
            Stay updated with the latest news, trends, and stories related to room renting and flatsharing.
          </p>

          {blogPosts.length > 0 ? (
            blogPosts.map(post => (
              <Card key={post.id} className="blog-post-card">
                <Card.Body>
                  <Card.Title as="h2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </Card.Title>
                  <Card.Text className="card-meta">
                    Posted on: {post.date} {post.author && `by ${post.author}`}
                  </Card.Text>
                  <Card.Text>
                    {post.excerpt}
                  </Card.Text>
                  <Button variant="primary" as={Link} to={`/blog/${post.slug}`}>Read More</Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-center"><em>Our blog posts are coming soon! Check back later.</em></p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPage;
