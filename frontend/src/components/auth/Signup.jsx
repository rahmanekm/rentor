import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import signupIcon from '../../assets/images/add-friend.png'; // Corrected path
import './signup.css'; 

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('Tenant'); // Added UserType state, default to Tenant
    // const [error, setError] = useState(''); // Using toast for errors
    const [loading, setLoading] = useState(false);
    
    let navigate = useNavigate();

    const onSubmit = async event => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        if (!userType) {
            toast.error("Please select an account type (Tenant or Landlord).");
            return;
        }

        setLoading(true);
        const loadingToastId = toast.loading('Creating your account...');

        try {
            // Use relative path for API call, Vite proxy will handle it
            await axios.post('/api/auth/register', {
                Name: name, // Ensure backend expects 'Name' (capitalized)
                Email: email,
                Password: password,
                UserType: userType 
            });
            toast.dismiss(loadingToastId);
            toast.success("Registration successful! Please log in.");
            navigate("/login"); 
        } catch (err) {
            toast.dismiss(loadingToastId);
            const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
            toast.error(errorMessage);
            console.error("Signup error:", err.response ? err.response.data : err.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page-spareroom"> 
            <div className="auth-form-container-spareroom"> 
                <img className="auth-icon-spareroom" src={signupIcon} alt="Signup Icon" />
                <h2>Create Your Account</h2>
                <p className="auth-subheading-spareroom">Join RoomRentor to find your perfect space or flatmate.</p>
                
                <form onSubmit={onSubmit} className="auth-form-spareroom">
                    <div className="form-group-spareroom">
                        <label htmlFor="name">Full Name</label>
                        <input 
                            type="text" 
                            id="name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            required 
                            placeholder="Enter your full name"
                            className="form-input-spareroom"
                        />
                    </div>

                    <div className="form-group-spareroom">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            required 
                            placeholder="you@example.com"
                            className="form-input-spareroom"
                        />
                    </div>

                    <div className="form-group-spareroom">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            required 
                            placeholder="Create a password (min. 6 characters)"
                            className="form-input-spareroom"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group-spareroom">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            required 
                            placeholder="Re-enter your password"
                            className="form-input-spareroom"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group-spareroom user-type-group-spareroom">
                        <legend>I am a:</legend>
                        <div className="user-type-options-spareroom">
                            <label htmlFor="userTypeTenant">
                                <input 
                                    type="radio" 
                                    id="userTypeTenant" 
                                    name="userType" 
                                    value="Tenant" 
                                    checked={userType === 'Tenant'} 
                                    onChange={(e) => setUserType(e.target.value)} 
                                />
                                Tenant
                            </label>
                            <label htmlFor="userTypeLandlord">
                                <input 
                                    type="radio" 
                                    id="userTypeLandlord" 
                                    name="userType" 
                                    value="Landlord" 
                                    checked={userType === 'Landlord'} 
                                    onChange={(e) => setUserType(e.target.value)} 
                                />
                                Landlord
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" className="form-button-spareroom" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="auth-switch-spareroom">
                    <p>Already have an account? <Link to="/login" className="auth-link-spareroom bold">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
