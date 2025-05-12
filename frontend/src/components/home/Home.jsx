import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Button } from 'react-bootstrap';

// Hero Slideshow Images
import HeroBg1 from "../../assets/images/hero-background.jpg";
import HeroBg2 from "../../assets/images/hero-background_1.jpg";
import HeroBg3 from "../../assets/images/hero-background_2.jpg";
import HeroBg4 from "../../assets/images/hero-background_3.jpg";

// Only import the single fallback image for locations
import LondonLocationImage from "../../assets/images/london-unsplash.jpg"; 

import "./home.css";

// SVG Icon Components - Defined once at the top level of the module
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> );
const ConnectIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> );
const MoveInIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg> );

const Home = () => {
    const [searchType, setSearchType] = useState('rooms');
    const heroImages = [HeroBg1, HeroBg2, HeroBg3, HeroBg4];
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

    const [locationInput, setLocationInput] = useState('');
    const [minRent, setMinRent] = useState('');
    const [maxRent, setMaxRent] = useState('');

    const navigate = useNavigate();
    const locationHook = useLocation(); 
    const { isAuthenticated, currentUser } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImageIndex(prevIndex => 
                prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    const handleMainSearch = (event) => {
        event.preventDefault();
        const queryParams = new URLSearchParams();
        if (locationInput) queryParams.append('city', locationInput);
        if (minRent) queryParams.append('minPrice', minRent); 
        if (maxRent) queryParams.append('maxPrice', maxRent); 

        if (searchType === 'rooms') {
            navigate(`/rooms?${queryParams.toString()}`);
        } else if (searchType === 'flatmates') {
            if (locationInput) {
                queryParams.delete('city'); 
                queryParams.set('preferred_locations', locationInput);
            }
            queryParams.delete('minPrice');
            queryParams.delete('maxPrice');
            navigate(`/flatmates?${queryParams.toString()}`);
        }
    };

    const handleListYourRoomClick = () => {
      if (!isAuthenticated) {
        toast("Please log in as a Landlord to list your room.", { icon: 'ℹ️' });
        navigate('/login', { state: { from: locationHook, message: "You need to be logged in as a Landlord to post an ad." } });
      } else if (currentUser.userType === 'Tenant') {
        toast.error("Only Landlords can list rooms. Please use a Landlord account.");
      } else if (currentUser.userType === 'Landlord') {
        navigate('/post-ad');
      }
    };
    
    return (
        <div className="home-spareroom">
            <div className="hero-section-spareroom" style={{ backgroundImage: `url(${heroImages[currentHeroImageIndex]})` }}>
                <div className="hero-overlay-spareroom"></div>
                <div className="hero-content-spareroom">
                    <h1>Your Next Chapter Starts Here.</h1>
                    <p>Find rooms and flatmates across the UK. Your next home is just a click away.</p>
                    
                    <div className="search-box-spareroom">
                        <div className="search-type-selector">
                            <button 
                                className={searchType === 'rooms' ? 'active' : ''} 
                                onClick={() => setSearchType('rooms')}>
                                Rooms for Rent
                            </button>
                            <button 
                                className={searchType === 'flatmates' ? 'active' : ''} 
                                onClick={() => setSearchType('flatmates')}>
                                Flatmates
                            </button>
                        </div>
                        <form className="search-form-spareroom" onSubmit={handleMainSearch}>
                            <input 
                                type="text" 
                                placeholder="Enter a location (e.g. 'London')" 
                                className="location-input-spareroom" 
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                            />
                            {searchType === 'rooms' && (
                                <div className="search-filters-spareroom">
                                    <input 
                                        type="number" 
                                        placeholder="Min Rent"
                                        value={minRent}
                                        onChange={(e) => setMinRent(e.target.value)} 
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Max Rent"
                                        value={maxRent}
                                        onChange={(e) => setMaxRent(e.target.value)} 
                                    />
                                </div>
                            )}
                            <button type="submit" className="search-button-spareroom">Search</button>
                        </form>
                        <div className="advanced-search-spareroom">
                            <Link to={searchType === 'rooms' ? "/rooms" : "/flatmates"}>Advanced Search</Link> 
                        </div>
                    </div>
                    <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={handleListYourRoomClick} 
                        className="mt-4 list-your-room-hero-btn"
                    >
                        List Your Room
                    </Button>
                </div>
            </div>

            <div className="how-it-works-spareroom section-padding-spareroom">
                <h2>How RoomRentor Works</h2>
                <div className="steps-spareroom">
                    <div className="step-spareroom"><div className="step-icon-spareroom"><SearchIcon /></div><h3>1. Search</h3><p>Find rooms or flatmates that match your criteria.</p></div>
                    <div className="step-spareroom"><div className="step-icon-spareroom"><ConnectIcon /></div><h3>2. Connect</h3><p>Contact advertisers or post an ad to find your match.</p></div>
                    <div className="step-spareroom"><div className="step-icon-spareroom"><MoveInIcon /></div><h3>3. Move In</h3><p>Arrange viewings and secure your new home.</p></div>
                </div>
            </div>

            <div className="popular-locations-spareroom section-padding-spareroom bg-lightgrey-spareroom">
                <h2>Explore East London Hotspots</h2>
                <div className="locations-grid-spareroom">
                    <Link to="/rooms?city=London&address=Shoreditch" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Shoreditch, East London" /> 
                        <div className="location-name-spareroom">Shoreditch</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Canary+Wharf" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Canary Wharf, East London" />
                        <div className="location-name-spareroom">Canary Wharf</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Stratford" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Stratford, East London" />
                        <div className="location-name-spareroom">Stratford</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Hackney" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Hackney, East London" />
                        <div className="location-name-spareroom">Hackney</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Bethnal+Green" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Bethnal Green, East London" />
                        <div className="location-name-spareroom">Bethnal Green</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Whitechapel" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Whitechapel, East London" />
                        <div className="location-name-spareroom">Whitechapel</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Ilford" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Ilford, East London/Essex" />
                        <div className="location-name-spareroom">Ilford</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Newbury+Park" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Newbury Park, East London/Essex" />
                        <div className="location-name-spareroom">Newbury Park</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Romford" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Romford, Greater London" />
                        <div className="location-name-spareroom">Romford</div>
                    </Link>
                    <Link to="/rooms?city=London&address=Barking" className="location-card-spareroom">
                        <img src={LondonLocationImage} alt="Barking, East London" />
                        <div className="location-name-spareroom">Barking</div>
                    </Link>
                </div>
                <Link to="/rooms?city=London" className="view-all-button-spareroom">View More in London</Link>
            </div>
            
            <div className="testimonials-section-spareroom section-padding-spareroom">
                <h2>What Our Users Say</h2>
                <div className="testimonial-card-spareroom"><p>“With RoomRentor, finding a place to rent was easier than ever! I moved into my apartment in under a week.”</p><p className="testimonial-author-spareroom">- Sarah M.</p></div>
                <div className="testimonial-card-spareroom"><p>“The search filters helped me narrow my options and find exactly what I wanted in my city without stress.”</p><p className="testimonial-author-spareroom">- James B.</p></div>
            </div>

            <div className="post-ad-cta-spareroom section-padding-spareroom bg-lightgrey-spareroom">
                <h2>Got a Room to Rent or Looking for a Flatmate?</h2>
                <p>Reach hundreds of potential tenants and flatmates by posting your ad today.</p>
                <Button variant="primary" size="lg" onClick={handleListYourRoomClick} className="post-ad-button-spareroom">
                    Post Your Ad FREE
                </Button>
            </div>
        </div>
    );
};

export default Home;
