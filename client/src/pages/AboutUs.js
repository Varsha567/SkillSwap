import React from 'react';
import '../css/AboutUs.css'; // Import the specific CSS for About Us

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="about-us-container">
        <h1>About SkillSwap</h1>
        <p>
          SkillSwap is a community-driven platform designed to foster learning, collaboration, and personal growth through the exchange of skills. In a world where knowledge is abundant but often siloed, SkillSwap breaks down barriers by connecting individuals who are eager to teach with those who are keen to learn.
        </p>
        <p>
          Whether you're looking to master a new programming language, refine your design skills, learn an instrument, or simply need help with a complex academic subject, SkillSwap provides a space where you can offer what you know and request what you need. Our goal is to create a vibrant ecosystem where knowledge flows freely, and everyone has the opportunity to expand their horizons.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to empower individuals by facilitating direct, peer-to-peer skill exchanges. We believe that everyone possesses unique talents and that by sharing these, we can build a more skilled, interconnected, and supportive global community. We are committed to providing an intuitive, secure, and rewarding platform for this exchange.
        </p>

        <h2>How It Works</h2>
        <p>
          Users can create listings to either "Offer a Skill" they possess or "Request a Skill" they wish to learn. Our matching system helps connect users based on their needs and offerings. Once a match is made, users can connect, arrange sessions, and embark on their learning journey. It's all about mutual growth and collective knowledge.
        </p>
        <p>
          Join SkillSwap today and unlock your potential – both as a teacher and as a lifelong learner!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
