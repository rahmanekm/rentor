import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, Form, Button, Card, Row, Col, Spinner, Image } from 'react-bootstrap'; // Added Image
import { useAuth } from '../../context/AuthContext';
import './MyFlatmateProfile.css';
import defaultProfileImage from '../../assets/images/user.png'; // Default if no image

const MyFlatmateProfile = () => {
  const { currentUser, login: updateAuthContextUser } = useAuth(); // Get login to update context
  const [formData, setFormData] = useState({
    Name: currentUser?.name || '',
    Email: currentUser?.email || '', // Usually not editable
    PhoneNumber: '',
    ProfilePictureURL: currentUser?.profilePictureURL || '', // From context initially
    Bio: '',
    looking_for_description: '',
    budget_min: '',
    budget_max: '',
    preferred_locations: '',
    move_in_date: '',
    is_actively_looking: false,
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const [initialLoading, setInitialLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [listingStatusLoading, setListingStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = useAuth(); // For logout on delete

  useEffect(() => {
    const fetchProfile = async () => {
      setInitialLoading(true);
      try {
        const response = await axios.get('/api/users/profile');
        if (response.data) {
          setFormData(prevData => ({
            ...prevData,
            Name: response.data.Name || prevData.Name,
            PhoneNumber: response.data.PhoneNumber || '',
            ProfilePictureURL: response.data.ProfilePictureURL || '', // Update from fetched data
            Bio: response.data.Bio || '',
            looking_for_description: response.data.LookingForDescription || '',
            budget_min: response.data.BudgetMin || '',
            budget_max: response.data.BudgetMax || '',
            preferred_locations: response.data.PreferredLocations || '',
            move_in_date: response.data.FlatmateMoveInDate ? new Date(response.data.FlatmateMoveInDate).toISOString().split('T')[0] : '',
            is_actively_looking: Boolean(response.data.IsActivelyLooking),
          }));
          // Set initial image preview if ProfilePictureURL exists
          if (response.data.ProfilePictureURL) {
            setImagePreviewUrl(`${import.meta.env.VITE_BACKEND_STATIC_URL}${response.data.ProfilePictureURL}`);
          } else {
            setImagePreviewUrl(defaultProfileImage);
          }
        }
      } catch (err) {
        toast.error('Failed to load your profile data.');
        console.error('Error fetching user profile:', err.response ? err.response.data : err.message);
        setImagePreviewUrl(defaultProfileImage); // Fallback on error
      }
      setInitialLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && name === 'profileImage') {
      const file = files[0];
      if (file) {
        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setProfileImageFile(null);
        // Revert to current profile picture URL from formData if file selection is cleared, or default
        setImagePreviewUrl(formData.ProfilePictureURL ? `${import.meta.env.VITE_BACKEND_STATIC_URL}${formData.ProfilePictureURL}` : defaultProfileImage);
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const loadingToastId = toast.loading('Saving profile details...');

    const submissionData = new FormData();
    submissionData.append('Name', formData.Name);
    submissionData.append('PhoneNumber', formData.PhoneNumber);
    submissionData.append('Bio', formData.Bio);
    submissionData.append('LookingForDescription', formData.looking_for_description);
    if (formData.budget_min) submissionData.append('BudgetMin', parseInt(formData.budget_min, 10));
    if (formData.budget_max) submissionData.append('BudgetMax', parseInt(formData.budget_max, 10));
    submissionData.append('PreferredLocations', formData.preferred_locations);
    if (formData.move_in_date) submissionData.append('FlatmateMoveInDate', formData.move_in_date);
    
    // If a new profile image file is selected, add it to FormData
    if (profileImageFile) {
      submissionData.append('profileImage', profileImageFile);
    } else if (formData.ProfilePictureURL === '' || formData.ProfilePictureURL === null) {
      // If user cleared the ProfilePictureURL (e.g. via a hypothetical "remove" button not yet implemented)
      // and didn't select a new file, send empty to signal removal.
      // Backend handles ProfilePictureURL: null or empty string for removal.
      // For now, this case is not explicitly handled by UI other than uploading new.
      // If ProfilePictureURL was manually cleared in a text field (old UI), this would be relevant.
      // With file input, if user wants to remove, they'd need a "remove" button.
      // If no new file, backend keeps old image unless ProfilePictureURL is explicitly sent as null/empty.
      // To allow removing: submissionData.append('ProfilePictureURL', '');
    }
    
    try {
      const response = await axios.put('/api/users/profile', submissionData); // Will send as multipart/form-data
      toast.dismiss(loadingToastId);
      toast.success(response.data.message || 'Profile details saved successfully!');
      
      // Update AuthContext with the new user details from backend response
      if (response.data.user) {
        updateAuthContextUser(response.data.user, localStorage.getItem('authToken'));
        // Update local form state for ProfilePictureURL if it changed
        setFormData(prev => ({ ...prev, ProfilePictureURL: response.data.user.ProfilePictureURL || '' }));
        if (response.data.user.ProfilePictureURL) {
            setImagePreviewUrl(`${import.meta.env.VITE_BACKEND_STATIC_URL}${response.data.user.ProfilePictureURL}`);
        } else {
            setImagePreviewUrl(defaultProfileImage);
        }
        setProfileImageFile(null); // Clear selected file after successful upload
      }
    } catch (err) {
      toast.dismiss(loadingToastId);
      const errorMsg = err.response?.data?.message || 'Failed to save profile details.';
      toast.error(errorMsg);
      console.error('Error saving profile details:', err.response ? err.response.data : err);
    }
    setFormLoading(false);
  };

  const handleToggleListingStatus = async () => {
    setListingStatusLoading(true);
    const newStatus = !formData.is_actively_looking;
    const actionText = newStatus ? 'Listing' : 'Unlisting';
    const loadingToastId = toast.loading(`${actionText} your profile...`);
    try {
      const response = await axios.put('/api/users/profile', { IsActivelyLooking: newStatus });
      toast.dismiss(loadingToastId);
      toast.success(`Profile ${actionText.toLowerCase()}ed successfully!`);
      setFormData(prev => ({ ...prev, is_actively_looking: newStatus }));
      if (response.data.user) { // Backend returns updated user
        updateAuthContextUser(response.data.user, localStorage.getItem('authToken'));
      }
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error(err.response?.data?.message || `Failed to ${actionText.toLowerCase()} profile.`);
      console.error(`Error ${actionText.toLowerCase()} profile:`, err.response ? err.response.data : err.message);
    }
    setListingStatusLoading(false);
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action is irreversible and will remove all your data.')) {
      setDeleteLoading(true);
      const loadingToastId = toast.loading('Deleting your account...');
      try {
        await axios.delete('/api/users/profile');
        toast.dismiss(loadingToastId);
        toast.success('Account deleted successfully.');
        auth.logout(); 
        navigate('/'); 
      } catch (err) {
        toast.dismiss(loadingToastId);
        toast.error(err.response?.data?.message || 'Failed to delete account.');
        console.error('Error deleting account:', err.response ? err.response.data : err.message);
        setDeleteLoading(false);
      }
    }
  };

  if (initialLoading) {
    return <Container className="profile-page-container text-center"><Spinner animation="border" className="mt-5" /><p>Loading your profile...</p></Container>;
  }

  return (
    <Container className="profile-page-container">
      <Row className="justify-content-md-center">
        <Col md={8} lg={7}>
          <Card className="profile-form-card">
            <Card.Body>
              <Card.Title as="h2">My Profile & Flatmate Preferences</Card.Title>
              <p>Update your personal details and flatmate seeking preferences.</p>
              <hr />
              <div className="text-center mb-4">
                <Image 
                  src={imagePreviewUrl || defaultProfileImage} 
                  alt="Profile Preview" 
                  roundedCircle 
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: '2px solid #dee2e6' }} 
                />
              </div>
              <Form onSubmit={handleSubmitDetails}>
                <Form.Group as={Row} className="mb-3" controlId="formProfileImage">
                  <Form.Label column sm={3}>Profile Picture</Form.Label>
                  <Col sm={9}>
                    <Form.Control type="file" name="profileImage" accept="image/png, image/jpeg, image/gif" onChange={handleChange} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formName">
                  <Form.Label column sm={3}>Full Name</Form.Label>
                  <Col sm={9}><Form.Control type="text" name="Name" value={formData.Name} onChange={handleChange} /></Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formPhoneNumber">
                  <Form.Label column sm={3}>Phone Number</Form.Label>
                  <Col sm={9}><Form.Control type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} /></Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBio">
                  <Form.Label>About Me (Bio)</Form.Label>
                  <Form.Control as="textarea" name="Bio" value={formData.Bio} onChange={handleChange} rows={4} />
                </Form.Group>

                <h4 className="mt-4 mb-3">Flatmate Preferences</h4>
                <Form.Group className="mb-3" controlId="formLookingFor">
                  <Form.Label>What I'm Looking For</Form.Label>
                  <Form.Control as="textarea" name="looking_for_description" value={formData.looking_for_description} onChange={handleChange} rows={4} />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formBudgetMin"><Form.Label>Min Budget (£ pcm)</Form.Label><Form.Control type="number" name="budget_min" value={formData.budget_min} onChange={handleChange} /></Form.Group>
                  <Form.Group as={Col} controlId="formBudgetMax"><Form.Label>Max Budget (£ pcm)</Form.Label><Form.Control type="number" name="budget_max" value={formData.budget_max} onChange={handleChange} /></Form.Group>
                </Row>
                <Form.Group className="mb-3" controlId="formPreferredLocations"><Form.Label>Preferred Locations</Form.Label><Form.Control type="text" name="preferred_locations" value={formData.preferred_locations} onChange={handleChange} /><Form.Text muted>Comma-separated.</Form.Text></Form.Group>
                <Form.Group className="mb-3" controlId="formMoveInDate"><Form.Label>Preferred Move-in Date</Form.Label><Form.Control type="date" name="move_in_date" value={formData.move_in_date} onChange={handleChange} /></Form.Group>
                
                <Button variant="primary" type="submit" disabled={formLoading || listingStatusLoading || deleteLoading} className="w-100 mt-3">
                  {formLoading ? 'Saving Details...' : 'Save Profile Details'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mt-4 profile-form-card">
            <Card.Body>
              <Card.Title as="h3">Flatmate Search Status</Card.Title>
              {formData.is_actively_looking ? (
                <p>Your profile is currently listed and visible in flatmate searches.</p>
              ) : (
                <p>Your profile is not currently listed. Click below to make it visible in flatmate searches.</p>
              )}
              <Button 
                variant={formData.is_actively_looking ? "outline-secondary" : "success"} 
                onClick={handleToggleListingStatus}
                disabled={formLoading || listingStatusLoading || deleteLoading}
                className="w-100"
              >
                {listingStatusLoading ? 'Updating...' : (formData.is_actively_looking ? 'Unlist My Profile from Flatmate Search' : 'List My Profile for Flatmate Search')}
              </Button>
            </Card.Body>
          </Card>

          <Card className="mt-4 profile-form-card">
            <Card.Body>
              <Card.Title as="h3" className="text-danger">Danger Zone</Card.Title>
              <p>Deleting your account is permanent and cannot be undone.</p>
              <Button 
                variant="danger" 
                onClick={handleDeleteProfile} 
                disabled={formLoading || listingStatusLoading || deleteLoading || initialLoading} 
              >
                {deleteLoading ? 'Deleting...' : 'Delete My Account'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyFlatmateProfile;
