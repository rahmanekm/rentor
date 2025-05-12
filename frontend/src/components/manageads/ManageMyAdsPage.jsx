import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext'; // To ensure user is landlord, though backend handles this
import './ManageMyAdsPage.css';
import defaultRoomImage from '../../assets/images/london-apt.jpg'; // Default if no image

const ManageMyAdsPage = () => {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State for managing status update of a specific listing
  const [statusUpdate, setStatusUpdate] = useState({}); // { listingId: newStatus }

  const fetchMyListings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/listings/my-listings');
      setMyListings(response.data.listings || []);
    } catch (err) {
      console.error("Error fetching landlord's listings:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to load your listings.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser?.userType === 'Landlord') {
      fetchMyListings();
    } else {
      // Should not happen if route is protected, but as a fallback
      toast.error("Access denied. Only landlords can manage ads.");
      navigate('/'); 
    }
  }, [currentUser, fetchMyListings, navigate]);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    
    const toastId = toast.loading('Deleting listing...');
    try {
      await axios.delete(`/api/listings/${listingId}`);
      toast.dismiss(toastId);
      toast.success('Listing deleted successfully!');
      fetchMyListings(); // Refresh the list
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to delete listing.');
      console.error('Error deleting listing:', err);
    }
  };

  const handleStatusChange = (listingId, newStatus) => {
    setStatusUpdate(prev => ({ ...prev, [listingId]: newStatus }));
  };

  const handleUpdateListingStatus = async (listingId) => {
    const newStatus = statusUpdate[listingId];
    if (!newStatus) {
      toast.error('Please select a new status.');
      return;
    }
    const toastId = toast.loading('Updating status...');
    try {
      await axios.patch(`/api/listings/${listingId}/status`, { Status: newStatus });
      toast.dismiss(toastId);
      toast.success('Listing status updated successfully!');
      // Update local state for immediate feedback or re-fetch
      setMyListings(prevListings => 
        prevListings.map(listing => 
          listing.ListingID === listingId ? { ...listing, Status: newStatus } : listing
        )
      );
      setStatusUpdate(prev => { // Clear status for this listing after update
        const newState = { ...prev };
        delete newState[listingId];
        return newState;
      });
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to update status.');
      console.error('Error updating status:', err);
    }
  };
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Pending': return 'warning';
      case 'Unavailable': return 'secondary';
      default: return 'light';
    }
  };

  if (loading) {
    return <Container className="manage-ads-page-container text-center"><Spinner animation="border" className="mt-5" /><p>Loading your listings...</p></Container>;
  }

  if (error) {
    return <Container className="manage-ads-page-container"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="manage-ads-page-container">
      <h1>Manage Your Ads</h1>
      {myListings.length === 0 ? (
        <Alert variant="info" className="no-ads-message">
          You haven't posted any ads yet. <Link to="/post-ad">Post your first ad now!</Link>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {myListings.map(listing => (
            <Col key={listing.ListingID}>
              <Card className="ad-management-card h-100">
                <Card.Img 
                  variant="top" 
                  src={listing.ImageUrl ? `${import.meta.env.VITE_BACKEND_STATIC_URL}${listing.ImageUrl}` : defaultRoomImage} 
                  alt={listing.Title}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{listing.Title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {listing.Address}, {listing.City}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Rent:</strong> £{listing.Rent}/month <br />
                    <strong>Status:</strong> <Badge bg={getStatusBadgeVariant(listing.Status)} className="ad-status-badge">{listing.Status}</Badge>
                  </Card.Text>
                  
                  <div className="mt-auto"> {/* Pushes actions to bottom */}
                    <Form.Group className="mb-2 status-select-group">
                      <InputGroup size="sm">
                        <Form.Select 
                          aria-label="Change status"
                          value={statusUpdate[listing.ListingID] || listing.Status}
                          onChange={(e) => handleStatusChange(listing.ListingID, e.target.value)}
                        >
                          <option value="Available">Available</option>
                          <option value="Pending">Pending</option>
                          <option value="Unavailable">Unavailable</option>
                        </Form.Select>
                        <Button 
                            variant="outline-primary" 
                            onClick={() => handleUpdateListingStatus(listing.ListingID)}
                            disabled={!statusUpdate[listing.ListingID] || statusUpdate[listing.ListingID] === listing.Status}
                        >
                            Update
                        </Button>
                      </InputGroup>
                    </Form.Group>
                    <div className="ad-actions mt-2">
                      <Button variant="info" size="sm" as={Link} to={`/rooms/${listing.ListingID}`}>View</Button>
                      <Button variant="warning" size="sm" as={Link} to={`/rooms/${listing.ListingID}/edit`}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteListing(listing.ListingID)}>Delete</Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ManageMyAdsPage;
