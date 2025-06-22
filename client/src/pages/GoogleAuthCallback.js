import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import '../css/Auth.css'; 

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authContextLoading } = useAuth(); // Removed checkAuth from here, login implicitly calls it.
  const [message, setMessage] = useState('Processing Google login...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authContextLoading) {
      // If AuthContext is still loading, wait for it to complete its initial check.
      // This prevents potential race conditions where we try to log in before AuthContext is ready.
      return; 
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const profileComplete = params.get('profileComplete') === 'true'; // Parse as boolean
    const username = params.get('username'); // Assume backend sends this for Google users
    const email = params.get('email');       // Assume backend sends this for Google users
    const authError = params.get('error');

    // Prevents re-processing if already logged in or navigating
    if (token && userId) {
      // Construct a comprehensive user object from URL params for AuthContext
      const userFromCallback = { 
        _id: userId, 
        id: userId, 
        profileComplete: profileComplete,
        username: username, // Include username
        email: email,       // Include email
      };

      console.log("GoogleAuthCallback: Received token and user data from URL.", userFromCallback);
      login(token, userFromCallback); 

      if (profileComplete === false) {
        setMessage('Profile incomplete. Redirecting to profile completion page...');
        navigate('/complete-profile', { replace: true });
      } else {
        setMessage('Login successful! Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }

    } else if (authError) {
      setError(`Google authentication failed: ${authError}.`);
      setMessage('Redirecting to login page with error...');
      console.error("GoogleAuthCallback: Authentication error:", authError);
      navigate(`/login?error=${authError}`, { replace: true });

    } else {
      setError('Google authentication failed. No token or specific error received.');
      setMessage('Redirecting to login page...');
      console.error("GoogleAuthCallback: No token or error received.");
      navigate('/login?error=google_auth_failed', { replace: true });
    }

  }, [location, navigate, login, authContextLoading]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-xl font-bold mb-4">{message}</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="spinner"></div> 
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
