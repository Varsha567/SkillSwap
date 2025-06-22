import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Header is rendered by Layout, so no Header import needed here
import SkillCard from '../components/SkillCard';
import '../css/dashboard.css'; // Keep your custom CSS import
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const Dashboard = () => {
  const navigate = useNavigate();
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [errorSkills, setErrorSkills] = useState(null);
  const { isLoggedIn } = useAuth();

  const testimonials = [
    {
      id: 1,
      text: "Thanks to SkillSwap, I finally learned Spanish while helping someone with their graphic design portfolio!",
      author: "Aisha, 22",
    },
    {
      id: 2,
      text: "Found an amazing mentor for my coding projects. The community here is fantastic!",
      author: "Mark, 30",
    },
    {
      id: 3,
      text: "Exchanging cooking tips for basic music theory has been incredibly rewarding.",
      author: "Sophia, 28",
    },
  ];

  useEffect(() => {
    const fetchFeaturedSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
        const data = await response.json();

        if (response.ok) {
          setFeaturedSkills((data.listings || []).slice(0, 4));
        } else {
          setErrorSkills(data.message || 'Failed to fetch featured skills.');
          console.error('Failed to fetch featured skills from backend:', data);
        }
      } catch (err) {
        setErrorSkills('Network error: Could not connect to the server to fetch featured skills.');
        console.error('Error fetching featured skills:', err);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchFeaturedSkills();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Swap Skills. Grow Together.</h1>
          <p className="hero-subtext">
            Exchange knowledge and expertise with passionate individuals worldwide. No money. Just mutual growth.
          </p>
          <div className="hero-buttons">
            {!isLoggedIn && (
              <button className="btn-primary" onClick={() => navigate('/signup')}>
                Get Started
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate('/browse')}>
              Browse Skills
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          {['Sign Up', 'Post Your Skills', 'Connect & Match', 'Start Swapping'].map((step, index) => (
            <div key={index} className="step-card">
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="featured-skills-section">
        <h2>Recently Posted Skills</h2>
        {loadingSkills ? (
          <p className="loading-message-text">Loading featured skills...</p>
        ) : errorSkills ? (
          <p className="error-message-text">{errorSkills}</p>
        ) : featuredSkills.length > 0 ? (
          <div className="skills-grid">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        ) : (
          <p className="no-skills-message">
            No skill listings available yet. Be the first to{' '}
            <Link to="/postskill" className="post-skill-link">
              post a skill
            </Link>
            !
          </p>
        )}
        <div className="text-center mt-8">
          <Link to="/browse" className="btn-secondary view-all-button">
            View All Skills
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Success Stories</h2>
        <div className="testimonial-carousel">
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <p className="quote">"{t.text}"</p>
                <p className="author">- {t.author}</p>
              </div>
            ))
          ) : (
            <p className="no-testimonials-message">No testimonials yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
