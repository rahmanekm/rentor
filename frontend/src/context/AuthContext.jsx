import React, { createContext, useState, useContext, useEffect, useRef } from 'react'; // Added useRef
import axios from 'axios'; // Import axios to set default headers
import toast from 'react-hot-toast'; // Import toast

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Dummy auth state for now - this will be replaced with actual API calls and token management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0); // State for unread messages
  const pollingIntervalRef = useRef(null); // Ref to store interval ID

  // TODO: Implement actual login logic
  // - Call backend /api/auth/login
  // - On success, store JWT token (e.g., in localStorage)
  // - Set isAuthenticated = true
  // - Set currentUser with user data from response (or decode from token)
  // - Set axios default headers if using axios: axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const login = (userDataFromResponse, token) => {
    console.log("AuthContext: Login called with", userDataFromResponse);
    localStorage.setItem('authToken', token); // Example: store token
    localStorage.setItem('currentUser', JSON.stringify(userDataFromResponse)); // Example: store user
    setIsAuthenticated(true);
    setCurrentUser(userDataFromResponse);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    toast(`Hi, ${userDataFromResponse.name || 'User'}! 👋`, { 
      duration: 4000, 
    });
    fetchUnreadMessagesCount(); // Fetch count on login
    startPollingUnreadMessages(); // Start polling on login
  };

  // Actual logout logic
  // - Remove JWT token from localStorage
  // - Set isAuthenticated = false
  // - Set currentUser = null
  // - Remove axios default headers: delete axios.defaults.headers.common['Authorization'];
  const logout = () => {
    console.log("AuthContext: Logout called");
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setTotalUnreadCount(0); // Reset count on logout
    stopPollingUnreadMessages(); // Stop polling on logout
    delete axios.defaults.headers.common['Authorization'];
  };

  const fetchUnreadMessagesCount = async () => {
    if (!localStorage.getItem('authToken')) return; // Don't fetch if not authenticated
    try {
      const response = await axios.get('/api/messages/unread-count');
      setTotalUnreadCount(response.data.totalUnread || 0);
    } catch (error) {
      console.error('Failed to fetch unread messages count:', error);
      // Don't show toast for polling errors to avoid spamming user
    }
  };

  const startPollingUnreadMessages = () => {
    stopPollingUnreadMessages(); // Clear existing interval if any
    fetchUnreadMessagesCount(); // Initial fetch
    pollingIntervalRef.current = setInterval(fetchUnreadMessagesCount, 30000); // Poll every 30 seconds
  };

  const stopPollingUnreadMessages = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };
  
  // Check for existing token on initial load and start polling if authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setCurrentUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        startPollingUnreadMessages(); 
      } catch (e) {
        console.error("Failed to parse stored user or token invalid:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount


  const value = { 
    isAuthenticated, 
    currentUser, 
    login, 
    logout,
    totalUnreadCount, // Expose count
    fetchUnreadMessagesCount // Expose manual refresh if needed elsewhere
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
