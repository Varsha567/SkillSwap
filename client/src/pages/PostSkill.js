import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/PostSkill.css'; // Import the PostSkill CSS

const PostSkill = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'offer', // 'offer' or 'request'
    skills: '', // comma-separated string for frontend, will be array for backend
    category: '💻 Programming', // Default to first enum value for category
    skillLevel: 'Beginner', // Default to 'Beginner' for skillLevel
    swapFor: '', // This field is now required by schema
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Get user from context

  // Define enum options directly in the component for dropdowns
  const categories = ['🎨 Design', '💻 Programming', '🎸 Music', '🧘 Yoga', '🌐 Language Exchange', '📚 Academics'];
  const skillLevels = ['Beginner', 'Intermediate', 'Expert'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token || !user) { 
      setErrorMessage('You must be logged in to post a skill.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      // Prepare payload for backend: skills as an array, include skillLevel and category
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s), // Convert to array
        category: formData.category, // Now comes from dropdown
        skillLevel: formData.skillLevel, // Now comes from dropdown
        swapFor: formData.swapFor, // Now required
      };

      console.log('Sending post skill request with payload:', payload);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Skill listing posted successfully!');
        // Clear the form after successful submission
        setFormData({
          title: '',
          description: '',
          type: 'offer',
          skills: '',
          category: '💻 Programming', // Reset to default
          skillLevel: 'Beginner', // Reset to default
          swapFor: '',
        });
        
        // Navigate to my-profile (where user's posts are shown) after a delay
        setTimeout(() => {
          navigate('/my-profile'); 
        }, 1500);

      } else {
        setErrorMessage(data.message || 'Failed to post skill listing.');
        console.error('Post skill failed (backend response):', data);
      }
    } catch (err) {
      console.error('Post skill error (frontend/network):', err);
      setErrorMessage('An error occurred while posting your skill. Please check network and server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-skill-page-container">
      <div className="post-skill-card">
        <h2 className="post-skill-title">Post a New Skill Listing</h2>

        {errorMessage && (
          <div className="error-message" role="alert">
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="success-message" role="alert">
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Listing Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Listing Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Python Tutoring, UI Design Help"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="form-textarea"
              placeholder="Provide details about the skill you are offering or requesting."
              required
            ></textarea>
          </div>

          {/* Type of Listing (Offer/Request) */}
          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Type of Listing
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="offer">Offer a Skill</option>
              <option value="request">Request a Skill</option>
            </select>
          </div>

          {/* Specific Skills (comma-separated) */}
          <div className="form-group">
            <label htmlFor="skills" className="form-label">
              Specific Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., JavaScript, React, Figma, SQL"
              required
            />
          </div>

          {/* Category (UPDATED TO DROPDOWN) */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Level (UPDATED TO DROPDOWN with new options) */}
          <div className="form-group">
            <label htmlFor="skillLevel" className="form-label">
              Skill Level
            </label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              className="form-select"
              required
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Swap For (NOW REQUIRED) */}
          <div className="mb-6">
            <label htmlFor="swapFor" className="form-label">
              Swap For (What skill/service are you looking for?)
            </label>
            <input
              type="text"
              id="swapFor"
              name="swapFor"
              value={formData.swapFor}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., German conversation, Logo design review"
              required // Added required based on schema
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Skill'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostSkill;
