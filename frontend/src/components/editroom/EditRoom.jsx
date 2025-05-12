import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import './EditRoom.css'; // Assuming styles are similar to PostAd or defined here

const EditRoom = () => {
  const { id: listingId } = useParams();
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Address: '',
    City: '',
    State: '',
    ZipCode: '',
    RoomType: 'Single',
    Rent: '',
    Deposit: '',
    AvailableDate: '',
    amenities: {},
    LeaseTerms: '',
    PetPolicy: 'Not Allowed',
    SmokingPolicy: 'Not Allowed',
    Status: 'Available', // Add Status field
  });
  const [roomImageFile, setRoomImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  // Same list as PostAd.jsx for consistency
  const availableAmenitiesList = [
    { key: 'wifi', label: 'WiFi' },
    { key: 'parking', label: 'Parking' },
    { key: 'laundry', label: 'Laundry' },
    { key: 'furnished', label: 'Furnished' },
    { key: 'air_conditioning', label: 'Air Conditioning' },
    { key: 'heating', label: 'Heating' },
    { key: 'kitchen_access', label: 'Kitchen Access' },
    { key: 'private_bathroom', label: 'Private Bathroom' },
  ];

  useEffect(() => {
    const fetchListingData = async () => {
      setInitialLoading(true);
      try {
        const response = await axios.get(`/api/listings/${listingId}`);
        const listing = response.data;
        
        // Initialize amenities state for the form
        const initialAmenitiesState = {};
        availableAmenitiesList.forEach(amenity => {
          initialAmenitiesState[amenity.key] = false; // Default to false
        });
        // Mark fetched amenities as true
        if (listing.Amenities && Array.isArray(listing.Amenities)) {
          listing.Amenities.forEach(fetchedAmenity => {
            const key = fetchedAmenity.Name.toLowerCase().replace(/\s+/g, '_'); // Normalize name to key
            // A more robust mapping might be needed if keys don't directly match normalized names
            const matchedKey = availableAmenitiesList.find(a => a.label.toLowerCase() === fetchedAmenity.Name.toLowerCase())?.key;
            if (matchedKey) {
                 initialAmenitiesState[matchedKey] = true;
            } else if (initialAmenitiesState.hasOwnProperty(key)) { // Fallback if direct key match
                 initialAmenitiesState[key] = true;
            }
          });
        }

        setFormData({
          Title: listing.Title || '',
          Description: listing.Description || '',
          Address: listing.Address || '',
          City: listing.City || '',
          State: listing.State || '',
          ZipCode: listing.ZipCode || '',
          RoomType: listing.RoomType || 'Single',
          Rent: listing.Rent || '',
          Deposit: listing.Deposit || '',
          AvailableDate: listing.AvailableDate ? new Date(listing.AvailableDate).toISOString().split('T')[0] : '',
          amenities: initialAmenitiesState,
          LeaseTerms: listing.LeaseTerms || '',
          PetPolicy: listing.PetPolicy || 'Not Allowed',
          SmokingPolicy: listing.SmokingPolicy || 'Not Allowed',
          Status: listing.Status || 'Available',
        });
        // TODO: Handle existing image display if ImageUrl is available from backend
        // setImagePreviewUrl(listing.ImageUrl || ''); 
      } catch (err) {
        toast.error('Failed to load listing data.');
        console.error('Error fetching listing data:', err);
        navigate('/rooms'); // Redirect if listing not found or error
      }
      setInitialLoading(false);
    };

    if (listingId) {
      fetchListingData();
    }
  }, [listingId, navigate]); // availableAmenitiesList can be added if it's not static

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name.startsWith('amenities.')) {
      const amenityKey = name.split('.')[1];
      setFormData(prev => ({ ...prev, amenities: { ...prev.amenities, [amenityKey]: checked } }));
    } else if (type === 'file' && name === 'roomImage') {
      const file = files[0];
      if (file) {
        setRoomImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setRoomImageFile(null);
        setImagePreviewUrl(''); // Or keep existing preview if backend supports partial update
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const loadingToastId = toast.loading('Updating your listing...');

    const submissionFormData = new FormData();
    // Append all fields similar to PostAd.jsx
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
    submissionFormData.append('Status', formData.Status); // Include status

    const selectedAmenityKeys = Object.keys(formData.amenities).filter(key => formData.amenities[key]);
    selectedAmenityKeys.forEach(key => submissionFormData.append('Amenities', key)); // Send keys

    if (roomImageFile) {
      submissionFormData.append('roomImage', roomImageFile); // Backend needs to handle this
    }
    // Note: If image is not changed, backend needs to know not to delete existing one.
    // This simple setup might overwrite/remove image if backend expects 'roomImage' for update.

    try {
      await axios.put(`/api/listings/${listingId}`, submissionFormData);
      toast.dismiss(loadingToastId);
      toast.success('Listing updated successfully!');
      navigate(`/rooms/${listingId}`);
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error(err.response?.data?.message || 'Failed to update listing.');
      console.error('Error updating listing:', err);
    }
    setFormLoading(false);
  };

  if (initialLoading) {
    return (
      <Container className="edit-room-page-container text-center">
        <Spinner animation="border" role="status" className="mt-5"><span className="visually-hidden">Loading...</span></Spinner>
        <p>Loading listing details...</p>
      </Container>
    );
  }

  return (
    <Container className="edit-room-page-container">
      <Row className="justify-content-md-center">
        <Col md={8} lg={7}>
          <Card className="edit-room-form-card">
            <Card.Body>
              <Card.Title as="h2" className="text-center">Edit Your Room Listing</Card.Title>
              <Form onSubmit={handleSubmit}>
                {/* Form fields are identical to PostAd.jsx, just pre-filled */}
                {/* Title */}
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title / Room Name *</Form.Label>
                  <Form.Control type="text" name="Title" value={formData.Title} onChange={handleChange} required />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" name="Description" value={formData.Description} onChange={handleChange} rows={4} />
                </Form.Group>

                {/* Address & Room Type */}
                <Row className="mb-3">
                  <Form.Group as={Col} md={8} controlId="formAddress">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control type="text" name="Address" value={formData.Address} onChange={handleChange} required />
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

                {/* City, State, ZipCode */}
                <Row className="mb-3">
                  <Form.Group as={Col} md={4} controlId="formCity">
                    <Form.Label>City *</Form.Label>
                    <Form.Control type="text" name="City" value={formData.City} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formState">
                    <Form.Label>State / County *</Form.Label>
                    <Form.Control type="text" name="State" value={formData.State} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formZipCode">
                    <Form.Label>Zip/Post Code *</Form.Label>
                    <Form.Control type="text" name="ZipCode" value={formData.ZipCode} onChange={handleChange} required />
                  </Form.Group>
                </Row>

                {/* Rent, Deposit, AvailableDate */}
                <Row className="mb-3">
                  <Form.Group as={Col} md={4} controlId="formRent">
                    <Form.Label>Rent (£ / month) *</Form.Label>
                    <Form.Control type="number" name="Rent" value={formData.Rent} onChange={handleChange} required min="1" step="0.01" />
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formDeposit">
                    <Form.Label>Deposit (£)</Form.Label>
                    <Form.Control type="number" name="Deposit" value={formData.Deposit} onChange={handleChange} min="0" step="0.01" />
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId="formAvailableDate">
                    <Form.Label>Available Date *</Form.Label>
                    <Form.Control type="date" name="AvailableDate" value={formData.AvailableDate} onChange={handleChange} required />
                  </Form.Group>
                </Row>
                
                {/* Status */}
                <Form.Group as={Col} md={4} controlId="formStatus" className="mb-3">
                    <Form.Label>Listing Status *</Form.Label>
                    <Form.Select name="Status" value={formData.Status} onChange={handleChange} required>
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Unavailable">Unavailable</option>
                    </Form.Select>
                  </Form.Group>

                {/* Amenities */}
                <Form.Group className="mb-3" controlId="formAmenities">
                  <Form.Label>Amenities</Form.Label>
                  <div className="amenities-checkbox-group">
                    {availableAmenitiesList.map(amenity => (
                      <Form.Check 
                        type="checkbox"
                        key={amenity.key}
                        id={`edit-amenity-${amenity.key}`}
                        name={`amenities.${amenity.key}`}
                        label={amenity.label}
                        checked={formData.amenities[amenity.key] || false}
                        onChange={handleChange}
                        className="amenity-checkbox-item"
                      />
                    ))}
                  </div>
                </Form.Group>

                {/* LeaseTerms, PetPolicy, SmokingPolicy */}
                <Form.Group className="mb-3" controlId="formLeaseTerms">
                  <Form.Label>Lease Terms</Form.Label>
                  <Form.Control as="textarea" name="LeaseTerms" value={formData.LeaseTerms} onChange={handleChange} rows={3} />
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
                      <option value="Allowed">Allowed</option>
                      <option value="Outside Only">Outside Only</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                
                {/* Image Upload */}
                <Form.Group className="mb-3" controlId="formRoomImage">
                  <Form.Label>Room Image (Optional - replacing existing image if new one uploaded)</Form.Label>
                  <Form.Control type="file" name="roomImage" accept="image/png, image/jpeg, image/gif" onChange={handleChange} />
                  {imagePreviewUrl && (
                    <div className="image-preview"><img src={imagePreviewUrl} alt="New room preview" /></div>
                  )}
                  {/* TODO: Display current image if one exists and no new one is selected for preview */}
                  {/* {!imagePreviewUrl && formData.currentImageUrl && (
                     <div className="image-preview"><img src={formData.currentImageUrl} alt="Current room" /></div>
                  )} */}
                  <Form.Text muted>Backend image update not yet fully implemented.</Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={formLoading || initialLoading} className="w-100 mt-3 py-2">
                  {formLoading ? 'Updating Listing...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditRoom;
