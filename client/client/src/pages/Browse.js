import React, { useState, useEffect, useCallback } from 'react';
import SkillCard from '../components/SkillCard';
import '../css/Browse.css'; // Your specific CSS for the Browse page
import '../css/dashboard.css';
const Browse = () => {
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.how-it-works-section, .step-card, .explore-skills-cta, .testimonial-card');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Add staggered delay for step cards
            if (entry.target.classList.contains('step-card')) {
              const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
              entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
          }
        });
      }, { threshold: 0.1 });
      
      elements.forEach(el => observer.observe(el));
    };
    
    animateOnScroll();
  }, []);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter State: Only category now, no skill level or text search
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Define available categories (should match your backend/model)
  const categories = [
    'All', 'Programming', 'Design', 'Music', 'Language Exchange', 'Academics'];

  // Function to fetch skills with applied category filter
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All') {
        queryParams.append('category', selectedCategory);
      }
      // Removed skillLevel and search query params

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/skills?${queryParams.toString()}`);
      const data = await response.json();

      if (response.ok && data.listings) {
        setSkills(data.listings);
      } else {
        setError(data.message || 'Failed to fetch skills.');
        console.error('Failed to fetch skills:', data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Network error: Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]); // Re-fetch when selectedCategory changes

  // Fetch skills on component mount and when category filter changes
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return (
    <div className="browse-page-container">
      {/* Hero Section for Browse Page */}
      <section className="browse-hero-section">
        <div className="browse-hero-content">
          <h1>Explore Skills for Swapping</h1> {/* Updated hero text */}
          <p className="browse-hero-subtext">
            Discover a wide range of expertise offered by our community.
          </p>
          {/* Category Buttons */}
          <div className="category-buttons-container">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {/* Optional: Add icons for categories if you want */}
                {/* Example with Font Awesome (make sure FA CDN is linked): */}
                {category === 'Programming' && <i className="fas fa-code"></i>}
                {category === 'Design' && <i className="fas fa-paint-brush"></i>}
                {category === 'Music' && <i className="fas fa-music"></i>}
                {category === 'Language Exchange' && <i className="fas fa-comments"></i>}
                {category === 'Academics' && <i className="fas fa-book-reader"></i>}
                {category === 'Cooking' && <i className="fas fa-utensils"></i>}
                {category === 'Crafts' && <i className="fas fa-cut"></i>}
                {category === 'Photography' && <i className="fas fa-camera-retro"></i>}
                {category === 'Writing' && <i className="fas fa-pen-nib"></i>}
                {category === 'Marketing' && <i className="fas fa-bullhorn"></i>}
                {category === 'Fitness' && <i className="fas fa-dumbbell"></i>}
                {category === 'Other' && <i className="fas fa-ellipsis-h"></i>}
                {category === 'All' && <i className="fas fa-grip-horizontal"></i>}
                
                <span>{category}</span> {/* Text for the category */}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Listings */}
      <section className="skill-listings-section">
        <h2 className="section-title">Available Skills</h2>
        {loading ? (
          <p className="loading-message-text">Loading skills...</p>
        ) : error ? (
          <p className="error-message-text">{error}</p>
        ) : skills.length > 0 ? (
          <div className="skills-grid">
            {skills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        ) : (
          <p className="no-skills-message">
            No matching skills found in the selected category.
          </p>
        )}
      </section>
    </div>
  );
};

export default Browse;
