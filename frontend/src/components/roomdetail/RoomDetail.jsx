import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Container, Row, Col, Image, Button, Card, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import './RoomDetail.css';
import defaultRoomImage from '../../assets/images/london-apt.jpg';

// SVG Icon Components (copied from existing file if they were there, or define as needed)
const WifiIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>;
const BillsIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const FurnishedIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 10v10"></path><path d="M2 16h20"></path></svg>;
const ParkingIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M19 12H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"/><path d="M12 12V2M7 4l5-2 5 2"/><path d="M5 10v2"/><path d="M19 10v2"/></svg>;
const LaundryIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M20.58 12.24A7.5 7.5 0 1 0 12 21.76M12 12v2.5M12 6.5V9M15.25 9.25l-1.25 1.25M8.75 9.25l1.25 1.25M15.25 14.75l-1.25-1.25M8.75 14.75l1.25-1.25M12 2.24A7.5 7.5 0 0 0 3.42 12.24"/></svg>;
const AirConditioningIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M12 4V2M8.707 5.293l-1.414-1.414M5.293 8.707 3.879 7.293M4 12H2M5.293 15.293l-1.414 1.414M8.707 18.707l-1.414 1.414M12 20v2M15.293 18.707l1.414 1.414M18.707 15.293l1.414-1.414M20 12h2M18.707 8.707l1.414-1.414M15.293 5.293l1.414-1.414"/><circle cx="12" cy="12" r="3"/><path d="M12 16a4 4 0 0 0 0-8"/></svg>;
const HeatingIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M12 4V2M8.707 5.293l-1.414-1.414M5.293 8.707 3.879 7.293M4 12H2M5.293 15.293l-1.414 1.414M8.707 18.707l-1.414 1.414M12 20v2M15.293 18.707l1.414 1.414M18.707 15.293l1.414-1.414M20 12h2M18.707 8.707l1.414-1.414M15.293 5.293l1.414-1.414"/><path d="M12 6a6 6 0 1 0 0 12"/></svg>;
const KitchenAccessIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M20 21V10M18 10V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6M4 21V10M2 10h20M7 15h2M7 18h2"/></svg>;
const PrivateBathroomIcon = () => <svg viewBox="0 0 24 24" className="amenity-icon-detail"><path d="M21 10H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10zM7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M12 14v4M10 16h4"/></svg>;


const RoomDetail = () => {
  const { id: listingId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Instantiate useLocation

  const fetchRoomDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/listings/${listingId}`);
      setRoom(response.data);
    } catch (err) {
      console.error(`Error fetching room details for room ${listingId}:`, err.response ? err.response.data : err.message);
      toast.error(err.response?.data?.message || 'Failed to load room details.');
    }
    setLoading(false);
  }, [listingId]);

  useEffect(() => {
    if (listingId) fetchRoomDetails();
  }, [listingId, fetchRoomDetails]);

  const handleDeleteRoom = async () => {
    if (!window.confirm('Are you sure you want to delete this room listing?')) return;
    setIsActionLoading(true);
    const loadingToastId = toast.loading('Deleting room...');
    try {
      await axios.delete(`/api/listings/${listingId}`);
      toast.dismiss(loadingToastId);
      toast.success('Room deleted successfully!');
      navigate('/my-listings'); // Navigate to manage ads page after deletion
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error(err.response?.data?.message || 'Failed to delete room.');
      setIsActionLoading(false);
    }
  };

  const handleContactLandlord = () => {
    if (!isAuthenticated) {
      toast.error("Please sign up or log in to contact the landlord.");
      navigate('/signup', { state: { from: location } }); // Redirect to signup page
      return;
    }
    if (room && room.LandlordID) {
      navigate(`/messages/chat/${room.LandlordID}`, {
        state: { 
          partnerInfo: { 
            PartnerID: room.LandlordID, 
            PartnerName: room.LandlordName, 
            PartnerProfilePictureURL: room.LandlordProfilePictureURL 
          } 
        }
      });
    } else {
      toast.error("Landlord information is not available.");
    }
  };

  const renderAmenities = (amenitiesArray) => {
    if (!amenitiesArray || amenitiesArray.length === 0) return <p>No amenities listed.</p>;
    const amenityIconMap = { /* ... same as before ... */ 
        wifi: <WifiIcon />, parking: <ParkingIcon />, furnished: <FurnishedIcon />,
        'bills included': <BillsIcon />, laundry: <LaundryIcon />, 'air conditioning': <AirConditioningIcon />,
        heating: <HeatingIcon />, 'kitchen access': <KitchenAccessIcon />, 'private bathroom': <PrivateBathroomIcon />,
    };
    return (
      <ul className="room-detail-amenities">
        {amenitiesArray.map((amenity) => {
          const amenityNameLower = amenity.Name.toLowerCase();
          const icon = amenityIconMap[amenityNameLower] || null;
          return ( <li key={amenity.AmenityID || amenity.Name}>{icon}{amenity.Name}</li> );
        })}
      </ul>
    );
  };

  if (loading) return <Container className="room-detail-page-container text-center"><Spinner animation="border" className="mt-5" /><p>Loading room details...</p></Container>;
  if (!room) return <Container className="room-detail-page-container text-center"><Alert variant="danger">Room not found.</Alert></Container>;

  const canContactLandlord = isAuthenticated && currentUser && currentUser.userId !== room.LandlordID;

  return (
    <Container className="room-detail-page-container">
      <Row>
        <Col md={8}>
          <div className="room-detail-header">
            <h1>{room.Title}</h1>
            <p className="room-detail-location">{room.Address ? `${room.Address}, ` : ''}{room.City}, {room.State} {room.ZipCode}</p>
          </div>
          <Image 
            src={room.ImageUrl ? `${import.meta.env.VITE_BACKEND_STATIC_URL}${room.ImageUrl}` : defaultRoomImage} 
            alt={room.Title} 
            fluid 
            className="room-detail-image" 
          />
          <Card className="room-detail-section">
            <Card.Body><Card.Title as="h2">Description</Card.Title><Card.Text>{room.Description || 'No description provided.'}</Card.Text></Card.Body>
          </Card>
          <Card className="room-detail-section">
            <Card.Body><Card.Title as="h2">Amenities</Card.Title>{renderAmenities(room.Amenities)}</Card.Body>
          </Card>
          <Card className="room-detail-section">
            <Card.Body>
              <Card.Title as="h2">Lease & Policies</Card.Title>
              <p><strong>Lease Terms:</strong> {room.LeaseTerms || 'Not specified'}</p>
              <p><strong>Pet Policy:</strong> {room.PetPolicy || 'Not specified'}</p>
              <p><strong>Smoking Policy:</strong> {room.SmokingPolicy || 'Not specified'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="room-detail-section">
            <Card.Body>
              <Card.Title as="h2">Details</Card.Title>
              <p className="room-detail-price">£{room.Rent} /month</p>
              <p><strong>Type:</strong> {room.RoomType}</p>
              <p><strong>Available From:</strong> {new Date(room.AvailableDate).toLocaleDateString()}</p>
              {room.Deposit && <p><strong>Deposit:</strong> £{room.Deposit}</p>}
              
              <div className="mt-3">
                {canContactLandlord ? (
                  <Button variant="primary" size="lg" className="d-block w-100" onClick={handleContactLandlord}>
                    Contact Landlord
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" className="d-block w-100" disabled>
                    Contact Landlord
                  </Button> 
                  // Or show "Login to contact" or nothing if not authenticated / is owner
                )}
              </div>
            </Card.Body>
          </Card>

          {isAuthenticated && room && currentUser && currentUser.userId === room.LandlordID && (
            <Card className="room-detail-section owner-actions-section">
              <Card.Body>
                <Card.Title as="h2">Manage Your Listing</Card.Title>
                <Link to={`/rooms/${room.ListingID}/edit`} style={{ marginRight: '10px' }}>
                  <Button variant="secondary">Edit Listing</Button>
                </Link>
                <Button variant="danger" onClick={handleDeleteRoom} disabled={isActionLoading}>
                  {isActionLoading ? 'Deleting...' : 'Delete Listing'}
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Link to="/rooms" className="back-to-list-link d-block mt-3">&laquo; Back to Rooms List</Link>
    </Container>
  );
};

export default RoomDetail;
