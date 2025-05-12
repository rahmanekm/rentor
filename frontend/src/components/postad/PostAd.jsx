import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, Form, Button, Card, Row, Col, FloatingLabel } from 'react-bootstrap';
// import { useAuth } from '../../context/AuthContext'; // Not strictly needed if backend handles landlord check via token
import './PostAd.css';

const PostAd = () => {
  // const { currentUser } = useAuth(); // Can be used to prefill landlord info if needed, or for checks
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Address: '',
    City: '',
    State: '',
    ZipCode: '',
    RoomType: 'Single', // Default value
    Rent: '', // Will be per month
    Deposit: '',
    AvailableDate: '',
    amenities: {}, // Object to hold boolean state for each amenity
    LeaseTerms: '',
    PetPolicy: 'Not Allowed', // Default
    SmokingPolicy: 'Not Allowed', // Default
  });
  const [roomImageFile, setRoomImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const availableAmenitiesList = [
    // Match these keys to what backend might expect or can map to IDs
    { key: 'wifi', label: 'WiFi' },
    { key: 'parking', label: 'Parking' },
    { key: 'laundry', label: 'Laundry' },
    { key: 'furnished', label: 'Furnished' },
    { key: 'air_conditioning', label: 'Air Conditioning' },
    { key: 'heating', label: 'Heating' },
    { key: 'kitchen_access', label: 'Kitchen Access' },
    { key: 'private_bathroom', label: 'Private Bathroom' },
    // Add more from your DB Amenities table if needed
  ];

  useEffect(() => {
    const initialAmenities = {};
    availableAmenitiesList.forEach(amenity => {
      initialAmenities[amenity.key] = false;
    });
    setFormData(prev => ({ ...prev, amenities: initialAmenities }));
  }, []); // Run once on mount

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name.startsWith('amenities.')) {
      const amenityKey = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        amenities: { ...prevData.amenities, [amenityKey]: checked }
      }));
    } else if (type === 'file' && name === 'roomImage') {
      const file = files[0];
      if (file) {
        setRoomImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setRoomImageFile(null);
        setImagePreviewUrl('');
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToastId = toast.loading('Submitting your ad...');

    // Basic client-side validation
    if (!formData.Title || !formData.Address || !formData.City || !formData.State || !formData.ZipCode || !formData.Rent || !formData.AvailableDate || !formData.RoomType) {
      toast.dismiss(loadingToastId);
      toast.error('Please fill in all required fields: Title, Address, City, State, ZipCode, Room Type, Rent, and Available Date.');
      setLoading(false);
      return;
    }

    const submissionFormData = new FormData();
    submissionFormData.append('Title', formData.Title);
    submissionFormData.append('Description', formData.Description);
    submissionFormData.append('Address', formData.Address);
    submissionFormData.append('City', formData.City);
    submissionFormData.append('State', formData.State);
    submissionFormData.append('ZipCode', formData.ZipCode);
    submissionFormData.append('RoomType', formData.RoomType);
    submissionFormData.append('Rent', parseFloat(formData.Rent));
    if (formData.Deposit) submissionFormData.append('Deposit', parseFloat(formData.Deposit));
    submissionFormData.append('AvailableDate', formData.AvailableDate);
    submissionFormData.append('LeaseTerms', formData.LeaseTerms);
    submissionFormData.append('PetPolicy', formData.PetPolicy);
    submissionFormData.append('SmokingPolicy', formData.SmokingPolicy);
    
    const selectedAmenityKeys = Object.keys(formData.amenities).filter(key => formData.amenities[key]);
    // Backend expects 'Amenities' as an array of IDs. For now, sending keys/names.
    // This will require backend modification to map names to IDs.
    selectedAmenityKeys.forEach(key => submissionFormData.append('Amenities', key));


    if (roomImageFile) {
      submissionFormData.append('roomImage', roomImageFile); // Backend needs to handle this
    }
    
    // Log FormData content for debugging (cannot directly log FormData object)
    // for (var pair of submissionFormData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]); 
    // }

    try {
      // Axios will set Content-Type to multipart/form-data automatically for FormData
      const response = await axios.post('/api/listings', submissionFormData);
      toast.dismiss(loadingToastId);
      toast.success('Room listing posted successfully!');
      navigate(`/rooms/${response.data.listingId}`); // Navigate to the new listing's detail page
    } catch (err) {
      toast.dismiss(loadingToastId);
      const errorMessage = err.response?.data?.message || 'Failed to post room. Please try again.';
      toast.error(errorMessage);
      console.error('Error posting room:', err.response ? err.response.data : err.message, err.response?.data);
    }
    setLoading(false);
  };

  return (
    <Container className="post-ad-page-container">
      <Row className="justify-content-md-center">
        <Col md={8} lg={7}>
          <Card className="post-ad-form-card">
            <Card.Body>
              <Card.Title as="h2" className="text-center">List Your Room</Card.Title>
              <p className="text-center text-muted mb-4">Fill out the details below to advertise your room.</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title / Room Name *</Form.Label>
                  <Form.Control type="text" name="Title" value={formData.Title} onChange={handleChange} required placeholder="e.g., Cozy Double Room near City Center" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" name="Description" value={formData.Description} onChange={handleChange} rows={4} placeholder="Detailed description of the room and property..." />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} md={8} controlId="formAddress">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control type="text" name="Address" value={formData.Address} onChange={handleChange} required placeholder="e.g., 123 Main St" />
                  </Form.Group>
                   <Form.Group as={Col} md={4} controlId="formRoomType">
                    <Form.Label>Room Type *</Form.Label>
                    <Form.Select name="RoomType" value={formData.RoomType} onChange={handleChange} required>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Studio">Studio</option>
                      <option value="Shared">Shared</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md={4} controlId="formCity">
                    <Form.Label>City *</Form.Label>
                    <Form.Control type="text" name="City" value={formData.City} onChange={handleChange} required placeholder="e.g., London"/>
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formState">
                    <Form.Label>State / County *</Form.Label>
                    <Form.Control type="text" name="State" value={formData.State} onChange={handleChange} required placeholder="e.g., Greater London"/>
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formZipCode">
                    <Form.Label>Zip/Post Code *</Form.Label>
                    <Form.Control type="text" name="ZipCode" value={formData.ZipCode} onChange={handleChange} required placeholder="e.g., E1 6AN"/>
                  </Form.Group>
                </Row>
                
                <Row className="mb-3">
                  <Form.Group as={Col} md={4} controlId="formRent">
                    <Form.Label>Rent (£ / month) *</Form.Label>
                    <Form.Control type="number" name="Rent" value={formData.Rent} onChange={handleChange} required min="1" step="0.01" placeholder="e.g., 750"/>
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formDeposit">
                    <Form.Label>Deposit (£)</Form.Label>
                    <Form.Control type="number" name="Deposit" value={formData.Deposit} onChange={handleChange} min="0" step="0.01" placeholder="e.g., 750 (optional)"/>
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formAvailableDate">
                    <Form.Label>Available Date *</Form.Label>
                    <Form.Control type="date" name="AvailableDate" value={formData.AvailableDate} onChange={handleChange} required />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formAmenities">
                  <Form.Label>Amenities</Form.Label>
                  <div className="amenities-checkbox-group">
                    {availableAmenitiesList.map(amenity => (
                      <Form.Check 
                        type="checkbox"
                        key={amenity.key}
                        id={`amenity-${amenity.key}`}
                        name={`amenities.${amenity.key}`}
                        label={amenity.label}
                        checked={formData.amenities[amenity.key] || false}
                        onChange={handleChange}
                        className="amenity-checkbox-item"
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLeaseTerms">
                  <Form.Label>Lease Terms</Form.Label>
                  <Form.Control as="textarea" name="LeaseTerms" value={formData.LeaseTerms} onChange={handleChange} rows={3} placeholder="e.g., Minimum 6 months, rolling contract afterwards..." />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} md={6} controlId="formPetPolicy">
                    <Form.Label>Pet Policy</Form.Label>
                    <Form.Select name="PetPolicy" value={formData.PetPolicy} onChange={handleChange}>
                      <option value="Not Allowed">Not Allowed</option>
                      <option value="Allowed">Allowed</option>
                      <option value="Case-by-Case">Case-by-Case</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="formSmokingPolicy">
                    <Form.Label>Smoking Policy</Form.Label>
                    <Form.Select name="SmokingPolicy" value={formData.SmokingPolicy} onChange={handleChange}>
                      <option value="Not Allowed">Not Allowed</option>
                      <option value="Allowed">Allowed (Specify where, e.g., outside only)</option>
                      <option value="Outside Only">Outside Only</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                
                <Form.Group className="mb-3" controlId="formRoomImage">
                  <Form.Label>Room Image (Optional)</Form.Label>
                  <Form.Control type="file" name="roomImage" accept="image/png, image/jpeg, image/gif" onChange={handleChange} />
                  {imagePreviewUrl && (
                    <div className="image-preview">
                      <img src={imagePreviewUrl} alt="Room preview" />
                    </div>
                  )}
                  <Form.Text muted>Backend image upload not yet implemented. This is a UI placeholder.</Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3 py-2">
                  {loading ? 'Submitting Ad...' : 'Post Your Ad'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostAd;
