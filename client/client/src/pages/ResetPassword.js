import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../css/Login.css'; // Use the shared auth styles

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true); 
  
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('No reset token found in the URL. Please use the link from your email.');
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- CRITICAL FIX: Clear previous messages and errors at the start of submission ---
    setMessage(''); 
    setError('');
    setLoading(true);

    if (!tokenValid) {
        setError('Cannot reset password: Invalid or missing token.');
        setLoading(false);
        return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- Success path: Only set success message ---
        setMessage(data.message || 'Password has been successfully reset. You can now log in with your new password.');
        setPassword('');
        setConfirmPassword('');
        setTokenValid(false); // Invalidate token state on success for UI
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } else {
        // --- Error path: Only set error message ---
        setError(data.message || 'Failed to reset password. The link might be invalid or expired.');
        setTokenValid(false); // Assume token is invalid on error
      }
    } catch (err) {
      // --- Network error path: Only set network error message ---
      console.error('Network error during password reset:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="mb-4 text-sm text-gray-400">
          Enter your new password below.
        </p>

        {/* Conditional rendering: Only show message OR error, not both */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {tokenValid ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="auth-input"
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          // Display a general error message if token becomes invalid/used
          <p className="error-message">
            {error || "Invalid or expired password reset link. Please try requesting a new one."}
            <br />
            <Link to="/forgotpassword" className="auth-switch-link">Request a new link</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
