import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { blogPosts } from '../../data/blogData'; // Import blog data
import './BlogPostDetailPage.css';

const BlogPostDetailPage = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.slug === postSlug);
    setPost(foundPost);
    setLoading(false);
    // Scroll to top when component mounts or postSlug changes
    window.scrollTo(0, 0);
  }, [postSlug]);

  if (loading) {
    // You could add a spinner here if data fetching were async
    return <Container className="blog-post-detail-container text-center"><p>Loading post...</p></Container>;
  }

  if (!post) {
    return (
      <Container className="blog-post-detail-container">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="blog-post-not-found">
              <h2>Post Not Found</h2>
              <p>Sorry, the blog post you are looking for does not exist or may have been moved.</p>
              <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="blog-post-detail-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/blog" }}>Blog</Breadcrumb.Item>
            <Breadcrumb.Item active>{post.title}</Breadcrumb.Item>
          </Breadcrumb>

          <Card>
            <Card.Body>
              <h1>{post.title}</h1>
              <p className="blog-post-meta">
                Posted on: {post.date} {post.author && `by ${post.author}`}
              </p>
              <hr />
              {/* Render HTML content safely */}
              <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </Card.Body>
          </Card>
          <Link to="/blog" className="btn btn-outline-secondary mt-4 d-block w-50 mx-auto">
            &laquo; Back to Blog List
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPostDetailPage;
