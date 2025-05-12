import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from 'axios';
import { Button } from 'react-bootstrap'; // Added Button import
import "./roomslist.css";

// Placeholder images - Corrected paths
import defaultRoomImage from "../../assets/images/london-apt.jpg"; // Default if no image from backend
// import userAvatarPlaceholder from "../../assets/images/user.png"; // If needed for advertiser

// SVG Icons for Amenities (can be moved to a separate utils/icons.js file later)
const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);
const BillsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const FurnishedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 10v10"></path><path d="M2 16h20"></path>
  </svg>
);
const ParkingIcon = () => ( // Example for Parking
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"/>
        <path d="M12 12V2M7 4l5-2 5 2"/>
        <path d="M5 10v2"/>
        <path d="M19 10v2"/>
    </svg>
);


function RoomsList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const locationHook = useLocation();
    const navigate = useNavigate();

    // State for filters
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [selectedMoveInDate, setSelectedMoveInDate] = useState(''); // Consider using a date picker library later
    const [selectedSortBy, setSelectedSortBy] = useState('relevance');

    // Populate filter states from URL params on initial load or URL change
    useEffect(() => {
        const queryParams = new URLSearchParams(locationHook.search);
        setSelectedPriceRange(queryParams.get('priceRange') || ''); // Assuming 'priceRange' like "0-500"
        setSelectedRoomType(queryParams.get('roomType') || '');
        setSelectedMoveInDate(queryParams.get('availableDate') || ''); // Backend expects 'availableDate'
        setSelectedSortBy(queryParams.get('sortBy') || 'relevance');
    }, [locationHook.search]);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError(null);
            try {
                // Use query params from react-router's location object
                const queryParams = new URLSearchParams(locationHook.search);
                // Add a cache-busting parameter
                queryParams.append('_cb', Date.now()); // cb for cache buster
                // API endpoint changed to /api/listings
                const searchUrl = `/api/listings?${queryParams.toString()}`; 
                console.log("Fetching rooms with URL (cache-busted):", searchUrl); 
                
                const response = await axios.get(searchUrl);
                // Backend returns { listings: [...] }, so access response.data.listings
                setRooms(response.data.listings || []); 
            } catch (err) {
                console.error("Error fetching rooms:", err);
                if (err.response && err.response.status === 404) {
                    setRooms([]); 
                    setError("No rooms found matching your criteria.");
                } else {
                    setError(err.response?.data?.message || err.message || "Failed to fetch rooms. Please try again later.");
                }
            }
            setLoading(false);
        };

        fetchRooms();
    }, [locationHook.search]);

    const renderAmenityIcons = (amenitiesString) => {
        if (!amenitiesString || typeof amenitiesString !== 'string') return null;
        const amenitiesArray = amenitiesString.split(',').map(amenity => amenity.trim().toLowerCase());
        
        const icons = [];
        if (amenitiesArray.includes("wifi")) icons.push(<span key="wifi" className="amenity-icon" title="WiFi"><WifiIcon /></span>);
        if (amenitiesArray.includes("bills included")) icons.push(<span key="bills" className="amenity-icon" title="Bills Included"><BillsIcon /></span>);
        if (amenitiesArray.includes("furnished")) icons.push(<span key="furnished" className="amenity-icon" title="Furnished"><FurnishedIcon /></span>);
        if (amenitiesArray.includes("parking")) icons.push(<span key="parking" className="amenity-icon" title="Parking"><ParkingIcon /></span>);
        // Add more conditions for other amenities
        
        return icons.length > 0 ? icons : null;
    };


    if (loading) {
        return <div className="page-container-spareroom"><p className="loading-message-spareroom">Loading rooms...</p></div>;
    }

    if (error && error !== "No rooms found matching your criteria.") {
        return <div className="page-container-spareroom"><p className="error-message-spareroom">Error: {error}</p></div>;
    }

    const handleApplyFilters = () => {
        const queryParams = new URLSearchParams(locationHook.search); // Preserve existing params like location from Home search

        // Update or remove based on current filter state
        if (selectedPriceRange) {
            const [min, max] = selectedPriceRange.split('-');
            queryParams.set('minPrice', min);
            if (max) queryParams.set('maxPrice', max);
            else queryParams.delete('maxPrice'); // For ranges like "1500+"
             // Store the combined range for easy re-population of the dropdown
            queryParams.set('priceRange', selectedPriceRange);
        } else {
            queryParams.delete('minPrice');
            queryParams.delete('maxPrice');
            queryParams.delete('priceRange');
        }

        if (selectedRoomType) queryParams.set('roomType', selectedRoomType);
        else queryParams.delete('roomType');

        if (selectedMoveInDate) queryParams.set('availableDate', selectedMoveInDate); // Backend expects availableDate
        else queryParams.delete('availableDate');
        
        if (selectedSortBy && selectedSortBy !== 'relevance') queryParams.set('sortBy', selectedSortBy);
        else queryParams.delete('sortBy'); // 'relevance' is default if no sortBy

        navigate(`/rooms?${queryParams.toString()}`);
    };

    return (
        <div className="page-container-spareroom">
            <div className="filter-sort-bar-spareroom">
                <div className="filter-group-spareroom">
                    <select name="price-range" aria-label="Price range" value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
                        <option value="">Price Range</option>
                        <option value="0-500">Up to £500</option>
                        <option value="500-1000">£500 - £1000</option>
                        <option value="1000-1500">£1000 - £1500</option>
                        <option value="1500-">£1500+</option> {/* Changed to 1500- for easier parsing */}
                    </select>
                    <select name="room-type" aria-label="Room type" value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)}>
                        <option value="">Room Type</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Studio">Studio</option>
                        <option value="Shared">Shared</option>
                    </select>
                    {/* For date, a proper date picker would be better. For now, text input. */}
                    <input 
                        type="date" // Changed to date type for better UX
                        placeholder="Move-in Date" 
                        aria-label="Move-in date" 
                        className="filter-input-spareroom"
                        value={selectedMoveInDate}
                        onChange={(e) => setSelectedMoveInDate(e.target.value)}
                    />
                    {/* <button className="more-filters-button-spareroom">More Filters</button> */}
                </div>
                <div className="sort-group-spareroom">
                    <label htmlFor="sort-by">Sort by: </label>
                    <select name="sort-by" id="sort-by" value={selectedSortBy} onChange={(e) => setSelectedSortBy(e.target.value)}>
                        <option value="relevance">Relevance</option>
                        <option value="rent_asc">Price: Low to High</option>
                        <option value="rent_desc">Price: High to Low</option>
                        <option value="date_new">Date Added: Newest</option>
                    </select>
                </div>
                 <Button variant="primary" onClick={handleApplyFilters} className="apply-filters-button-spareroom">Apply Filters</Button>
            </div>

            <div className="RoomsList-spareroom">
                {rooms.length === 0 && !loading && (
                     <p className="no-rooms-found-spareroom">{error || "No rooms available at the moment. Try adjusting your search!"}</p>
                )}
                {rooms.map(room => {
                    console.log('Room object in RoomsList map:', room); // Debug log
                    const imageUrl = (room.ImageUrl || room.imageurl) 
                                     ? `${import.meta.env.VITE_BACKEND_STATIC_URL}${room.ImageUrl || room.imageurl}` 
                                     : defaultRoomImage;
                    console.log(`ListingID: ${room.ListingID}, Title: ${room.Title}, Effective Thumbnail URL: ${imageUrl}`); // Log effective URL
                    return (
                    <div key={room.ListingID} className="room-card-spareroom">
                        <div 
                            className="room-thumbnail-spareroom" 
                            style={{ 
                                backgroundImage: `url(${imageUrl})` 
                            }}
                        > 
                            <div className="room-price-spareroom">£{room.Rent} /month</div> {/* Assuming Rent is monthly */}
                        </div>
                        <div className="room-details-spareroom">
                            <h3 className="room-name-spareroom">{room.Title}</h3>
                            <p className="room-location-spareroom">{room.Address ? `${room.Address}, ` : ''}{room.City}</p> 
                            <p className="room-type-spareroom">{room.RoomType}</p>
                            <p className="room-availability-spareroom">Available from: {new Date(room.AvailableDate).toLocaleDateString()}</p>
                            
                            <div className="room-amenities-spareroom">
                                {renderAmenityIcons(room.AmenitiesNames)} 
                            </div>

                            <div className="room-description-snippet-spareroom">
                                <p>{room.Description ? room.Description.substring(0, 100) + (room.Description.length > 100 ? '...' : '') : 'No description available.'}</p>
                            </div>
                            
                            {/* Advertiser info can be added if LandlordName is included in listing results */}
                            {room.LandlordName && (
                                <div className="advertiser-info-spareroom">
                                    {/* <img src={userAvatarPlaceholder} alt={room.LandlordName} className="advertiser-avatar-spareroom" /> */}
                                    <div className="advertiser-avatar-placeholder-spareroom"></div> {/* Simple placeholder */}
                                    <span className="advertiser-name-spareroom">Advertised by {room.LandlordName}</span>
                                </div>
                            )}
                            
                            <Link to={`/rooms/${room.ListingID}`} className="view-details-button-spareroom">
                                View Details
                            </Link>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RoomsList;
