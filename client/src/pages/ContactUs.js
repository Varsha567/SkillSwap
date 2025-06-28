import React from 'react';
import '../css/ContactUs.css'; // Import the specific CSS for Contact Us

const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <div className="contact-us-container">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out to the SkillSwap team. Your input helps us improve and grow our community.
        </p>
        <p>
          Please use the contact information below to get in touch. We aim to respond to all inquiries within 24-48 business hours.
        </p>

        <div className="contact-info-section">
          <h3>Get in Touch</h3>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <p>Email: <a href="mailto:skillswap.platform.mail@gmail.com">skillswap.platform.mail@gmail.com</a></p>
          </div>
          {/* You can add more contact info here if desired, e.g., phone, address */}
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Address: 123 Skill Exchange Rd, Innovation City, SW 12345</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone-alt"></i>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
