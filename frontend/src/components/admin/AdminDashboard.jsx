import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Select an option to manage content.</p>
      <ul>
        <li><Link to="/admin/listings">Manage Listings</Link></li>
        <li><Link to="/admin/profiles">Manage Profiles</Link></li>
        {/* Add more admin links as needed */}
      </ul>
    </div>
  );
};

export default AdminDashboard;