import React from 'react';
import { Link } from 'react-router-dom';
import '../css/dashboard.css';
import skillswapLogo from '../assets/skillswap.png'; 

const Header = ({ isLoggedIn }) => {
  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <Link to="/">
          <img src={skillswapLogo} alt="SkillSwap Logo" className="logo" />
          
         </Link>
      </div>
      
      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/browse" className="nav-link">Browse Skills</Link>
        <Link to="/postskill" className="nav-link">Post a Skill</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </nav>
      
      <div className="header-actions">
        {isLoggedIn ? (
          <Link to="/profile" className="profile-link">My Profile</Link>
        ) : (
          <>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;