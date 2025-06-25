import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/dashboard.css'; // Your custom CSS import

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // Get isLoggedIn status

  const howItWorksSteps = [
    {
      icon: 'fas fa-user-plus', // Font Awesome icon for Sign Up
      title: 'Sign Up & Build Your Profile',
      description: 'Create an account and tell us about your skills offered and skills needed. It\'s quick and easy!'
    },
    {
      icon: 'fas fa-bullhorn', // Font Awesome icon for Post Skills
      title: 'Post Your Skill Listings',
      description: 'Offer a skill you possess (e.g., Python tutoring) or request a skill you want to learn (e.g., UI Design help).'
    },
    {
      icon: 'fas fa-hands-helping', // Font Awesome icon for Connect
      title: 'Connect & Collaborate',
      description: 'Browse listings, find a match, and connect directly with other users to start your skill exchange journey.'
    },
    {
      icon: 'fas fa-chart-line', // Font Awesome icon for Growth
      title: 'Learn, Grow, Repeat',
      description: 'Gain new knowledge, refine your expertise, and build a valuable network. The more you swap, the more you grow!'
    }
  ];

  const testimonials = [
    {
      id: 1,
      text: "Thanks to SkillSwap, I finally learned Spanish while helping someone with their graphic design portfolio! It's a truly unique and effective way to learn.",
      author: "Aisha, 22"
    },
    {
      id: 2,
      text: "Found an amazing mentor for my coding projects through SkillSwap. The community here is fantastic and incredibly supportive!",
      author: "Mark, 30"
    },
    {
      id: 3,
      text: "Exchanging cooking tips for basic music theory has been incredibly rewarding. SkillSwap made it so simple to connect with the right person.",
      author: "Sophia, 28"
    },
    {
      id: 4,
      text: "I used to pay for online courses, but SkillSwap offers a personal touch and real-world application that's priceless. Highly recommend!",
      author: "David, 35"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Swap Skills. Grow Together.</h1>
          <p className="hero-subtext">
            Unlock your potential by exchanging knowledge and expertise with passionate individuals worldwide. No money. Just mutual growth.
          </p>
          <div className="hero-buttons">
            {!isLoggedIn ? (
              <button className="btn-primary" onClick={() => navigate('/signup')}>
                Get Started
              </button>
            ) : (
              // If logged in, maybe a different CTA or just the browse button
              <button className="btn-primary" onClick={() => navigate('/postskill')}>
                Post Your Skill
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate('/browse')}>
              Browse All Skills
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="step-card">
              <i className={`${step.icon} step-icon`}></i> {/* Use Font Awesome icon */}
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Call to Action to Explore Skills (replaces "Featured Skills") */}
      <section className="explore-skills-cta">
        <h2>Ready to Explore Skills?</h2>
        <p>
          Join our vibrant community and discover a world of learning opportunities, or share your own expertise.
        </p>
        <div className="cta-buttons">
          {!isLoggedIn && (
            <Link to="/login" className="btn-primary cta-button">
              Login to Get Started
            </Link>
          )}
          <Link to="/browse" className="btn-secondary cta-button">
            {isLoggedIn ? "Browse Skills Now" : "View Public Listings"}
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2> {/* More professional title */}
        <div className="testimonial-grid"> {/* Changed to grid for better layout */}
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <p className="quote">"{t.text}"</p>
                <p className="author">- {t.author}</p>
              </div>
            ))
          ) : (
            <p className="no-testimonials-message">No testimonials yet. Be the first to share your story!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
