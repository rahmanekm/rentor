import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import appLogo from '../../assets/images/logo.jpg'; // Adjusted path
import { useAuth } from "../../context/AuthContext"; // Corrected import path
import { Badge, Button } from 'react-bootstrap'; // Import Badge and Button

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, logout, totalUnreadCount } = useAuth(); // Added totalUnreadCount
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); 
    if (isMobileMenuOpen) {
        toggleMobileMenu(); 
    }
  };

  // Close mobile menu on navigating via a Link
  useEffect(() => {
    if (isMobileMenuOpen) {
        // This effect is intended to close the menu when a navigation occurs.
        // However, simply depending on `navigate` might not be enough if `navigate` instance doesn't change.
        // A more robust way might involve listening to route changes if using React Router's features,
        // or ensuring toggleMobileMenu is called effectively by Link onClick handlers.
        // For now, the Link onClick handlers already call toggleMobileMenu.
    }
  }, [isMobileMenuOpen]); // Simplified dependency, or listen to location if needed.


  return (
    <nav className="navbar-spareroom">
      <div className="navbar-container-spareroom">
        <Link to="/" className="navbar-logo-spareroom" onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
          <img src={appLogo} alt="RoomRentor Logo" className="navbar-logo-image-spareroom" />
          <span className="navbar-logo-text-spareroom">RoomRentor</span>
        </Link>
        
        <button className="mobile-menu-toggle-spareroom" aria-label="Open navigation menu" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <div className={`navbar-links-spareroom ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-menu-spareroom">
            <li className="nav-item-spareroom">
              <Link to="/find-a-room" className="nav-link-spareroom" onClick={toggleMobileMenu}>Find a Room</Link>
            </li>
            <li className="nav-item-spareroom">
              <Link to="/flatmates" className="nav-link-spareroom" onClick={toggleMobileMenu}>Flatmates</Link>
            </li>
            <li className="nav-item-spareroom">
              <Link to="/pricing" className="nav-link-spareroom" onClick={toggleMobileMenu}>Pricing</Link>
            </li>            {!isAuthenticated && (
              <>
                <li className="nav-item-spareroom">
                  <Link to="/blog" className="nav-link-spareroom" onClick={toggleMobileMenu}>Blog</Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li className="nav-item-spareroom">
                <Link to="/messages" className="nav-link-spareroom" onClick={toggleMobileMenu}>
                  Messages
                  {totalUnreadCount > 0 && (
                    <Badge pill bg="danger" className="ms-1">
                      {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                    </Badge>
                  )}
                </Link>
              </li>
            )}
            {isAuthenticated && currentUser?.userType === 'Landlord' && (
              <>
                <li className="nav-item-spareroom mobile-only-action-links">
                  <Link to="/post-ad" className="nav-link-spareroom action-link-spareroom" onClick={toggleMobileMenu}>List Your Ad</Link>
                </li>
                <li className="nav-item-spareroom mobile-only-action-links">
                  <Link to="/my-listings" className="nav-link-spareroom action-link-spareroom" onClick={toggleMobileMenu}>Manage My Ads</Link>
                </li>
              </>
            )}
            {isAuthenticated && ( /* My Profile available to all logged-in users */
              <>
                <li className="nav-item-spareroom mobile-only-action-links" style={currentUser?.userType === 'Tenant' ? { padding: '8px 15px' } : {}}>
                  {currentUser?.userType === 'Tenant' ? (
                    <Button as={Link} to="/my-flatmate-profile" variant="success" size="sm" className="w-100" onClick={toggleMobileMenu}>
                      List My Profile
                    </Button>
                  ) : (
                    <Link to="/my-flatmate-profile" className="nav-link-spareroom action-link-spareroom" onClick={toggleMobileMenu}>
                      My Profile
                    </Link>
                  )}
                </li>
                <li className="nav-item-spareroom mobile-only-action-links" style={{ padding: '8px 15px' }}>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-danger btn-sm w-100"
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-actions-spareroom desktop-only">
          {isAuthenticated ? (
            <>
              {currentUser?.userType === 'Tenant' ? (
                <Link to="/my-flatmate-profile" className="nav-button-spareroom post-ad-button-spareroom" style={{marginRight: '10px'}}>
                  List My Profile
                </Link>
              ) : (
                <Link to="/my-flatmate-profile" className="nav-link-spareroom action-link-spareroom" style={{marginRight: '10px'}}>
                  My Profile
                </Link>
              )}
              {currentUser?.userType === 'Landlord' && (
                <>
                  <Link to="/my-listings" className="nav-link-spareroom action-link-spareroom" style={{marginRight: '10px'}}>Manage My Ads</Link>
                  <Link to="/post-ad" className="nav-button-spareroom post-ad-button-spareroom">List Your Ad</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-button-spareroom logout-button-style" style={{marginLeft: '15px'}}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button-spareroom login-button-style">Log in</Link>
              <Link to="/register" className="nav-button-spareroom post-ad-button-spareroom" style={{marginLeft: '15px'}}>Sign up</Link> {/* Reusing post-ad style for primary */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
