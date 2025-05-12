import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Alert, Spinner, Form, Button, InputGroup, Pagination } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import './FlatmateList.css';
import defaultProfileImage from '../../assets/images/user.png';

const FlatmateList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth(); // Get currentUser and isAuthenticated

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [filterLocation, setFilterLocation] = useState('');
  const [filterBudgetMin, setFilterBudgetMin] = useState('');
  const [filterBudgetMax, setFilterBudgetMax] = useState('');
  const [filterMoveInDate, setFilterMoveInDate] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setFilterLocation(queryParams.get('preferred_locations') || '');
    setFilterBudgetMin(queryParams.get('budget_min') || '');
    setFilterBudgetMax(queryParams.get('budget_max') || '');
    setFilterMoveInDate(queryParams.get('move_in_date') || '');
    setCurrentPage(parseInt(queryParams.get('page') || '1', 10));
  }, [location.search]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams(location.search);
        if (!queryParams.has('page')) {
          queryParams.set('page', currentPage.toString());
        }
        queryParams.append('_cb', Date.now());
        
        const searchUrl = `/api/users/flatmate-search?${queryParams.toString()}`;
        const response = await axios.get(searchUrl);

        setProfiles(response.data.profiles || []);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 0);
      } catch (err) {
        console.error('Error fetching flatmate profiles:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Failed to load flatmate profiles.');
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [location.search, currentPage]);

  const handleApplyFlatmateFilters = () => {
    const queryParams = new URLSearchParams();
    if (filterLocation) queryParams.set('preferred_locations', filterLocation);
    if (filterBudgetMin) queryParams.set('budget_min', filterBudgetMin);
    if (filterBudgetMax) queryParams.set('budget_max', filterBudgetMax);
    if (filterMoveInDate) queryParams.set('move_in_date', filterMoveInDate);
    queryParams.set('page', '1'); 
    
    navigate(`/flatmates?${queryParams.toString()}`);
  };

  const handlePageChange = (pageNumber) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', pageNumber.toString());
    navigate(`/flatmates?${queryParams.toString()}`);
  };

  const handleMessageUser = (profileToMessage) => {
    if (!isAuthenticated) {
      // Should not happen if button is conditionally rendered, but as a safeguard
      navigate('/login', { state: { from: location } }); 
      return;
    }
    navigate(`/messages/chat/${profileToMessage.UserID}`, {
      state: {
        partnerInfo: {
          PartnerID: profileToMessage.UserID,
          PartnerName: profileToMessage.Name,
          PartnerProfilePictureURL: profileToMessage.ProfilePictureURL
        }
      }
    });
  };

  if (loading) {
    return (
      <Container className="flatmate-list-page text-center">
        <Spinner animation="border" role="status" className="mt-5"><span className="visually-hidden">Loading...</span></Spinner>
        <p>Loading flatmate profiles...</p>
      </Container>
    );
  }

  return (
    <Container className="flatmate-list-page">
      <h2 className="my-4 text-center">Find a Flatmate</h2>
      <p className="text-center mb-4">Browse profiles of people looking for flatmates or to share a room.</p>

      <Card className="mb-4 p-3 filter-card-flatmates">
        <Form>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="filterLocation">
                <Form.Label>Preferred Location</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g., Shoreditch" 
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Label>Budget (£ pcm)</Form.Label>
              <InputGroup>
                <Form.Control 
                  type="number" 
                  placeholder="Min" 
                  aria-label="Minimum budget"
                  value={filterBudgetMin}
                  onChange={(e) => setFilterBudgetMin(e.target.value)}
                />
                <InputGroup.Text>-</InputGroup.Text>
                <Form.Control 
                  type="number" 
                  placeholder="Max" 
                  aria-label="Maximum budget"
                  value={filterBudgetMax}
                  onChange={(e) => setFilterBudgetMax(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Group controlId="filterMoveInDate">
                <Form.Label>Move-in Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={filterMoveInDate}
                  onChange={(e) => setFilterMoveInDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleApplyFlatmateFilters} className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}
      {!loading && !error && profiles.length === 0 && (<Alert variant="info" className="text-center">No flatmate profiles match your criteria. Try broadening your search!</Alert>)}

      {!error && profiles.length > 0 && (
        <>
          <Row>
            {profiles.map(profile => (
              <Col md={6} lg={4} key={profile.UserID} className="mb-4">
                <Card className="h-100 flatmate-profile-card-item">
                  <Card.Img variant="top" src={profile.ProfilePictureURL ? `${import.meta.env.VITE_BACKEND_STATIC_URL}${profile.ProfilePictureURL}` : defaultProfileImage} alt={profile.Name} style={{ height: '200px', objectFit: 'cover' }}/>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{profile.Name || 'User'}</Card.Title>
                    <hr />
                    {profile.Bio && <Card.Text><strong>About me:</strong> {profile.Bio.substring(0,100)}{profile.Bio.length > 100 ? '...' : ''}</Card.Text>}
                    {profile.LookingForDescription && <Card.Text className="mt-2"><strong>Looking for:</strong> {profile.LookingForDescription.substring(0,100)}{profile.LookingForDescription.length > 100 ? '...' : ''}</Card.Text>}
                    <div className="mt-auto pt-2">
                      {(profile.BudgetMin || profile.BudgetMax) && (<Card.Text className="mt-3"><strong>Budget:</strong> {profile.BudgetMin ? ` £${profile.BudgetMin}` : ''}{(profile.BudgetMin && profile.BudgetMax) ? ' -' : ''}{profile.BudgetMax ? ` £${profile.BudgetMax}` : ''}{ (profile.BudgetMin || profile.BudgetMax) && ' pcm'}</Card.Text>)}
                      {profile.PreferredLocations && <Card.Text><strong>Preferred Locations:</strong> {profile.PreferredLocations}</Card.Text>}
                      {profile.FlatmateMoveInDate && <Card.Text><strong>Move-in Date:</strong> {new Date(profile.FlatmateMoveInDate).toLocaleDateString()}</Card.Text>}
                      {isAuthenticated && currentUser && currentUser.userId !== profile.UserID && (
                        <Button variant="outline-primary" size="sm" className="mt-2 w-100" onClick={() => handleMessageUser(profile)}>
                          Message {profile.Name ? profile.Name.split(' ')[0] : 'User'}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map(page => (<Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>{page + 1}</Pagination.Item>))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default FlatmateList;
