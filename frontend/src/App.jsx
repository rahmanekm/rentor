import './App.css'; // We'll need to ensure this CSS content is appropriate
// Bootstrap CSS is imported in main.jsx
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation // To use in interceptor for navigation
} from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast'; // Import toast for ProtectedRoute
import axios from 'axios'; // Import axios for interceptor setup

import { AuthProvider, useAuth } from './context/AuthContext'; // Import from new context file
// --- START Placeholder Components & Context ---
// TODO: Replace these with actual implementations from the old project or new ones.

// ProtectedRoute now uses useAuth from the new context file
const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const { isAuthenticated, currentUser } = useAuth(); 
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && allowedUserTypes.length > 0 && !allowedUserTypes.includes(currentUser?.userType)) {
    // User is authenticated but does not have the required role
    // You can redirect to a specific "Unauthorized" page or show a message
    // For now, redirecting to home with a toast message.
    toast.error("Access Denied: You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

// Import the real Navbar
import Navbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer'; // Import the real Footer
import Home from './components/home/Home'; // Import the real Home component
import Login from './components/auth/Login'; // Import the real Login component
import Signup from './components/auth/Signup'; // Import the real Signup component
import RoomsList from './components/roomslist/RoomsList'; // Import the real RoomsList component
import RoomDetail from './components/roomdetail/RoomDetail'; // Import the real RoomDetail component
import MyFlatmateProfile from './components/flatmates/MyFlatmateProfile'; // Import the real MyFlatmateProfile
import FlatmateList from './components/flatmates/FlatmateList'; // Import the real FlatmateList
import PostAd from './components/postad/PostAd'; // Import the real PostAd component
import EditRoom from './components/editroom/EditRoom'; // Import the real EditRoom component
import AdvicePage from './components/advice/AdvicePage';
import BlogPage from './components/blog/BlogPage';
import BlogPostDetailPage from './components/blog/BlogPostDetailPage';
import ManageMyAdsPage from './components/manageads/ManageMyAdsPage';
import ConversationsPage from './components/messaging/ConversationsPage'; // Import ConversationsPage
import ChatPage from './components/messaging/ChatPage'; // Import ChatPage

// General Page Placeholders
// const Login = () => <div>Login Page. Content to be integrated.</div>; // Replaced by real component
// const Signup = () => <div>Signup Page. Content to be integrated.</div>; // Replaced by real component
// const PostAd = () => <div>Post Ad Page (Protected). Content to be integrated.</div>; // Replaced by real component
// const RoomDetail = () => <div>Room Detail Page. Content to be integrated.</div>; // Replaced by real component
// const MyFlatmateProfile = () => <div>My Flatmate Profile Page (Protected). Content to be integrated.</div>; // Replaced by real component
// const FlatmateList = () => <div>Flatmate List Page. Content to be integrated.</div>; // Replaced by real component
// const AdvicePage = () => <div>Advice Page. Content to be integrated.</div>; // Replaced by real component
// const BlogPage = () => <div>Blog Page. Content to be integrated.</div>; // Replaced by real component
// const EditRoom = () => <div>Edit Room Page (Protected). Content to be integrated.</div>; // Replaced by real component
const NotFound = () => <div><h2>404 - Page Not Found</h2><p>Sorry, the page you are looking for does not exist.</p><Link to="/">Go to Homepage</Link></div>;

// --- END Placeholder Components & Context ---

// Axios Interceptor Setup Component
const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth(); // Get logout from AuthContext

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Only logout if user was previously authenticated, to avoid loops on login page
          if (isAuthenticated) { 
            toast.error("Your session has expired. Please log in again.");
            logout(); // Clear auth state and token
            // Redirect to login, preserving the intended path if desired
            navigate('/login', { state: { from: location }, replace: true });
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate, logout, location, isAuthenticated]); 

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AxiosInterceptor> {/* Wrap routes or relevant part with interceptor */}
        <div className="App"> {/* className "App" can be styled by src/App.css */}
          <Toaster 
            position="bottom-left" 
          reverseOrder={false}
          toastOptions={{
            duration: 3000, // Adjusted duration
          }}
        />
        <Navbar /> 
        <main className="main-content-area-spareroom"> {/* Removed inline padding and minHeight */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<RoomsList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route 
              path="/post-ad" 
              element={<ProtectedRoute allowedUserTypes={['Landlord']}><PostAd /></ProtectedRoute>} 
            />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route 
              path="/my-flatmate-profile" // Accessible by any authenticated user
              element={<ProtectedRoute><MyFlatmateProfile /></ProtectedRoute>}
            />
            <Route path="/flatmates" element={<FlatmateList />} />
            <Route path="/find-a-room" element={<RoomsList />} /> 
            <Route path="/advice" element={<AdvicePage />} />
            <Route path="/blog" exact element={<BlogPage />} /> {/* List of posts */}
            <Route path="/blog/:postSlug" element={<BlogPostDetailPage />} /> {/* Individual post */}
            <Route 
              path="/my-listings" 
              element={<ProtectedRoute allowedUserTypes={['Landlord']}><ManageMyAdsPage /></ProtectedRoute>} 
            />
            <Route 
              path="/messages" 
              element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} 
            />
            <Route 
              path="/messages/chat/:otherUserId" 
              element={<ProtectedRoute><ChatPage /></ProtectedRoute>} 
            />
            <Route 
              path="/rooms/:id/edit" 
              element={<ProtectedRoute allowedUserTypes={['Landlord']}><EditRoom /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
          </Routes>
        </main>
        <Footer />
        </div>
      </AxiosInterceptor>
    </AuthProvider>
  );
}

export default App;
