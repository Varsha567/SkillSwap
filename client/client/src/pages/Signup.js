import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Reverted to original path
import '../css/Login.css'; // Reverted to original path
import google_logo from '../assets/google-logo.png'; // Reverted to original path

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json(); // Backend should send userId, username, email, profileComplete

            if (response.ok) {
                console.log('Signup successful (raw backend response):', data);

                // Construct a complete user object from backend response
                const userDataForContext = {
                    _id: data.userId,
                    id: data.userId,
                    username: data.username,
                    email: data.email,
                    profileComplete: data.profileComplete,
                };
                console.log('Signup successful (userData passed to AuthContext):', userDataForContext);
                login(data.token, userDataForContext);

                // Navigate based on profileComplete status
                if (userDataForContext.profileComplete === false) {
                    navigate('/complete-profile', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }

            } else {
                setError(data.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            console.error('Network error during signup:', err);
            setError('An error occurred during signup. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Join SkillSwap</h2>
                <form onSubmit={handleSignup} className="auth-form">
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                {/* Social login section moved inside auth-card */}
                <div className="social-login-separator">
                    <hr />
                    <p>OR</p>
                    <hr />
                </div>
                <button className="google-signin-button" onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`}>
                    <img src={google_logo} alt="Google icon" className="google-icon" />
                    Continue with Google
                </button>

                <p className="auth-switch-link mt-4">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
