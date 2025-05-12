import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, Form, Button, Spinner, Alert, Image, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './ChatPage.css';
import defaultAvatar from '../../assets/images/user.png'; // Default avatar

const ChatPage = () => {
  const { otherUserId } = useParams();
  const { currentUser } = useAuth();
  const location = useLocation(); // To get passed state (partner info)
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partnerInfo, setPartnerInfo] = useState(location.state?.partnerInfo || null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null); // To scroll to bottom

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    if (!otherUserId || !currentUser) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/messages/conversation/${otherUserId}`);
      setMessages(response.data || []);
      // If partnerInfo wasn't passed via state, try to infer from messages (less ideal)
      // Or make a separate call to get user info if needed: /api/users/:id/public-profile (needs backend)
      if (!partnerInfo && response.data.length > 0) {
        const firstMessage = response.data[0];
        if (firstMessage.SenderID === parseInt(otherUserId)) {
          setPartnerInfo({ PartnerID: firstMessage.SenderID, PartnerName: firstMessage.SenderName, PartnerProfilePictureURL: null /* Not available here */ });
        } else if (firstMessage.ReceiverID === parseInt(otherUserId)) {
          setPartnerInfo({ PartnerID: firstMessage.ReceiverID, PartnerName: firstMessage.ReceiverName, PartnerProfilePictureURL: null });
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to load messages.");
      if (err.response?.status === 403 || err.response?.status === 401) navigate('/messages');
    }
    setLoading(false);
  }, [otherUserId, currentUser, partnerInfo, navigate]);

  useEffect(() => {
    if (!currentUser) {
      toast.error("You must be logged in to view messages.");
      navigate('/login');
      return;
    }
    fetchMessages();
  }, [currentUser, fetchMessages, navigate]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUserId) return;
    setSending(true);
    try {
      const response = await axios.post('/api/messages', {
        ReceiverID: parseInt(otherUserId),
        MessageContent: newMessage,
      });
      // Optimistically add message or re-fetch
      setMessages(prevMessages => [...prevMessages, { 
        ...response.data.newMessageDetails, // Assuming backend returns the full new message object
        MessageID: response.data.messageId, 
        SenderID: currentUser.userId, 
        ReceiverID: parseInt(otherUserId), 
        MessageContent: newMessage, 
        SentAt: new Date().toISOString(),
        SenderName: currentUser.name 
        // ReceiverName would be partnerInfo.PartnerName
      }]);
      setNewMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
      console.error('Error sending message:', err);
    }
    setSending(false);
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !partnerInfo) { // Show full page loader if no partner info yet
    return <Container className="chat-page-container text-center"><Spinner animation="border" className="mt-5" /><p>Loading chat...</p></Container>;
  }
  
  // If partnerInfo is still null after initial load attempt (e.g. direct navigation without state)
  // and messages haven't loaded to infer it. This needs a robust solution like fetching partner details.
  // For now, we rely on location.state or inference from first message.
  const partnerName = partnerInfo?.PartnerName || 'User';
  const partnerAvatar = partnerInfo?.PartnerProfilePictureURL 
    ? `${import.meta.env.VITE_BACKEND_STATIC_URL}${partnerInfo.PartnerProfilePictureURL}` 
    : defaultAvatar;


  return (
    <Container className="chat-page-container">
      <div className="chat-header">
        <Link to="/messages" className="btn btn-light back-to-conversations" aria-label="Back to conversations">
          &larr;
        </Link>
        <div className="partner-avatar">
          <Image src={partnerAvatar} alt={partnerName} roundedCircle />
        </div>
        <div className="partner-name">{partnerName}</div>
      </div>

      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      
      <div className="messages-area">
        {loading && messages.length === 0 && <div className="text-center"><Spinner animation="border" size="sm" /><p>Loading messages...</p></div>}
        {!loading && messages.length === 0 && !error && (
          <Alert variant="info" className="no-messages-alert">No messages yet. Start the conversation!</Alert>
        )}
        {messages.map((msg) => (
          <div 
            key={msg.MessageID} 
            className={`message-bubble ${msg.SenderID === currentUser.userId ? 'sent' : 'received'}`}
          >
            {msg.MessageContent}
            <span className="message-timestamp">{formatTimestamp(msg.SentAt)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Form onSubmit={handleSendMessage} className="message-input-area">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            autoFocus
          />
          <Button variant="primary" type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send'}
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
};

export default ChatPage;
