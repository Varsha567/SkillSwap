import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Header.css';

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Define an Inline SVG for the avatar placeholder
  // This SVG is a simple circle with a person icon inside
  const AvatarSvgPlaceholder = () => (
    <svg className="avatar-placeholder-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.29-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.93-3.5 3.22-6 3.22z"/>
    </svg>
  );

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="https://placehold.co/50x50/ADD8E6/000000?text=SS" alt="SkillSwap Logo" className="logo-img" />
          SkillSwap
        </Link>
        <nav className="header-nav">
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/browse" className="nav-link">Browse Skills</Link></li>
            {isLoggedIn && (
              <li><Link to="/postskill" className="nav-link">Post a Skill</Link></li>
            )}
            <li><Link to="/about" className="nav-link">About Us</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>
        </nav>
        <div className="header-auth-section">
          {isLoggedIn ? (
            <div className={`avatar-dropdown-container ${isDropdownOpen ? 'is-open' : ''}`} ref={dropdownRef}>
              <button className="avatar-button" onClick={toggleDropdown}>
                {user?.avatar ? ( // If user has an avatar URL, display it
                  <img src={user.avatar} alt="User Avatar" className="avatar-img" />
                ) : ( // Otherwise, display the Inline SVG placeholder
                  <AvatarSvgPlaceholder />
                )}
                <span className="avatar-username">{user?.username || user?.email?.split('@')[0]}</span>
                <i className={`fas fa-chevron-down dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></i>
              </button>
              <div className="dropdown-menu">
                <Link to="/my-profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogoutClick} className="dropdown-item logout-button-in-dropdown">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-button login-button">Login</Link>
              <Link to="/signup" className="auth-button signup-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
