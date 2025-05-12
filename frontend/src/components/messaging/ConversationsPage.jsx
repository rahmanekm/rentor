import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, ListGroup, Spinner, Alert, Image, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './ConversationsPage.css';
import defaultAvatar from '../../assets/images/user.png'; // Default avatar

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/messages/my-conversations');
      setConversations(response.data || []);
    } catch (err) {
      console.error("Error fetching conversations:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to load your conversations.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      toast.error("You must be logged in to view messages.");
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [currentUser, fetchConversations, navigate]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    // More sophisticated date formatting can be added (e.g., "Yesterday", "5 mins ago")
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <Container className="conversations-page-container text-center"><Spinner animation="border" className="mt-5" /><p>Loading conversations...</p></Container>;
  }

  if (error) {
    return <Container className="conversations-page-container"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="conversations-page-container">
      <h1>Your Messages</h1>
      {conversations.length === 0 ? (
        <Alert variant="info" className="no-conversations-message">
          You have no conversations yet. Start one by contacting a landlord or a flatmate seeker!
        </Alert>
      ) : (
        <ListGroup variant="flush">
          {conversations.map(convo => (
            <ListGroup.Item 
              key={convo.PartnerID} 
              as={Link} 
              to={`/messages/chat/${convo.PartnerID}`} 
              className="conversation-list-item"
            >
              <div className="conversation-avatar">
                <Image 
                  src={convo.PartnerProfilePictureURL ? `${import.meta.env.VITE_BACKEND_STATIC_URL}${convo.PartnerProfilePictureURL}` : defaultAvatar} 
                  alt={convo.PartnerName} 
                  roundedCircle 
                />
              </div>
              <div className="conversation-details">
                <div className="conversation-partner-name">{convo.PartnerName}</div>
                <div className="conversation-last-message">
                  {convo.LastMessageSenderID === currentUser.userId ? 'You: ' : ''}
                  {convo.LastMessage ? convo.LastMessage.substring(0, 50) + (convo.LastMessage.length > 50 ? '...' : '') : 'No messages yet.'}
                </div>
              </div>
              <div className="conversation-meta">
                <span className="conversation-time">{formatTimestamp(convo.LastMessageSentAt)}</span>
                {convo.UnreadCount > 0 && (
                  <Badge pill bg="danger" className="unread-badge ms-2">
                    {convo.UnreadCount}
                  </Badge>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default ConversationsPage;
