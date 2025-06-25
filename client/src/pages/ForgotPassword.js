import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css'; // Use the shared auth styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'If an account with that email exists, a password reset link has been sent to your inbox.');
        setEmail(''); // Clear email field
      } else {
        // Backend typically sends a generic message even if email not found for security
        setError(data.message || 'Could not send reset link. Please try again.');
      }
    } catch (err) {
      console.error('Network error during forgot password:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password?</h2>
        <p className="mb-4 text-sm text-gray-400">
          Enter your email address below and we'll send you a link to reset your password.
        </p>
        
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="your.email@example.com"
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="auth-switch-link">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
