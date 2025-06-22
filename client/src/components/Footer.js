import React from 'react';
import { Link } from 'react-router-dom'; // For internal navigation
import '../css/Footer.css'; // Import the footer specific CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
    

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-list">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/browse" className="footer-link">Browse Skills</Link></li>
            <li><Link to="/postskill" className="footer-link">Post a Skill</Link></li>
            <li><Link to="/my-profile" className="footer-link">My Profile</Link></li>
          </ul>
        </div>

        {/* Support Section */}
        
      </div>

      {/* Bottom Copyright Section */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} <span>SkillSwap</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
