import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ isLogin, onSubmit, formData, handleChange }) => {
  return (
    <div className="auth-container" style={{ background: '#141416' }}>
      <div className="auth-card" style={{ background: '#533F4D' }}>
        <h2 style={{ color: '#FFFFFF' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={onSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="auth-input"
              />
            </div>
          )}
          
          <div className="auth-input-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="auth-input"
            />
          </div>
          
          <div className="auth-input-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="auth-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-btn"
            style={{
              background: '#A3492F',
              color: '#FFFFFF'
            }}
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer" style={{ color: '#FFFFFF' }}>
          {isLogin ? (
            <>
              Don't have an account? <a href="/signup" style={{ color: '#EE7C53' }}>Sign up</a>
            </>
          ) : (
            <>
              Already have an account? <a href="/login" style={{ color: '#EE7C53' }}>Login</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;