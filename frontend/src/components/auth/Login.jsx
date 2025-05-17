import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // Assuming axios is installed in the new project
import { useAuth } from "../../context/AuthContext"; // Corrected path
import toast from 'react-hot-toast';
import loginIcon from '../../assets/images/user.png'; // Corrected path, ensure user.png was copied
import './login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [error, setError] = useState(''); // Using toast for errors
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const onSubmit = async event => {
        event.preventDefault();
        setLoading(true);
        const loadingToastId = toast.loading('Logging you in...');

        try {
            // Use relative path for API call, Vite proxy will handle it
            const response = await axios.post('/api/auth/login', {
                Email: email,     // Capitalized
                Password: password // Capitalized
            });

            // Backend returns: { message, token, userId, name, userType, emailVerified }
            // AuthContext login function expects: login(userDataFromResponse, token)
            // response.data itself contains all user details plus the token.
            // The token is also a field within response.data.
            auth.login(response.data, response.data.token); 
            
            toast.dismiss(loadingToastId);
            toast.success(response.data.message || 'Login successful!'); 
            navigate("/pricing"); // Redirect to pricing page after login

        } catch (err) {
            toast.dismiss(loadingToastId);
            const errorMessage = err.response?.data?.message || "Login failed. Please check credentials.";
            toast.error(errorMessage);
            console.error("Login error:", err.response ? err.response.data : err.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page-spareroom">
            <div className="auth-form-container-spareroom">
                <img className="auth-icon-spareroom" src={loginIcon} alt="Login Icon" />
                <h2>Welcome Back!</h2>
                <p className="auth-subheading-spareroom">Log in to continue to RoomRentor.</p>
                
                <form onSubmit={onSubmit} className="auth-form-spareroom">
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
                            placeholder="Enter your password"
                            className="form-input-spareroom"
                        />
                    </div>

                    <div className="form-options-spareroom">
                        <Link to="/forgot-password" className="auth-link-spareroom">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="form-button-spareroom" disabled={loading}>
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                
                <div className="auth-switch-spareroom">
                    <p>Don't have an account? <Link to="/register" className="auth-link-spareroom bold">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
