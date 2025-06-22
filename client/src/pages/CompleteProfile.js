import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/CompleteProfile.css';
import '../css/SkillCard.css';

const CompleteProfile = () => { 
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [profileFormData, setProfileFormData] = useState({
    fullName: '',
    bio: '',
    skillsOffered: '',
    skillsNeeded: '',
    discordHandle: '',
  });
  const [userPosts, setUserPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [profileErrorMessage, setProfileErrorMessage] = useState('');
  const [profileSuccessMessage, setProfileSuccessMessage] = useState('');
  const [postsErrorMessage, setPostsErrorMessage] = useState('');
  // New state to manage loading/disabling during status update
  const [isEditingStatus, setIsEditingStatus] = useState({}); // Stores postId: true/false

  // --- Effect to fetch user profile ---
  useEffect(() => {
    const fetchExistingProfile = async () => {
      setProfileLoading(true);
      setProfileErrorMessage('');
      const token = localStorage.getItem('token');
      if (!token) {
        setProfileErrorMessage('Not authenticated. Please log in.');
        setProfileLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok && data) {
          setProfileFormData({
            fullName: data.fullName || '',
            bio: data.bio || '',
            skillsOffered: Array.isArray(data.skillsOffered) ? data.skillsOffered.join(', ') : '',
            skillsNeeded: Array.isArray(data.skillsNeeded) ? data.skillsNeeded.join(', ') : '',
            discordHandle: data.discordHandle || '',
          });
          setProfileSuccessMessage('Profile data loaded.');
        } else {
          const msg = data.message || `Failed to load existing profile data. Status: ${response.status}.`;
          setProfileErrorMessage(msg);
          console.error('CompleteProfile useEffect (Profile Fetch): Failed to fetch profile:', response.status, data);
        }
      } catch (err) {
        console.error('CompleteProfile useEffect (Profile Fetch): Error fetching existing profile:', err);
        setProfileErrorMessage('An error occurred while loading your profile data. Check network or server logs.');
      } finally {
        setProfileLoading(false);
      }
    };
    fetchExistingProfile();
  }, [navigate]);

  // --- Effect to fetch user's posts ---
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?._id) { 
        setPostsLoading(false);
        setPostsErrorMessage('User not authenticated for fetching posts.');
        return;
      }

      setPostsLoading(true);
      setPostsErrorMessage('');
      const token = localStorage.getItem('token');
      if (!token) {
        setPostsErrorMessage('Authentication token missing for fetching posts.');
        setPostsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/skills/user/${user._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok && data.listings) {
          setUserPosts(data.listings);
        } else {
          setPostsErrorMessage(data.message || `Failed to fetch your posts. Status: ${response.status}.`);
          console.error('CompleteProfile useEffect (Posts Fetch): Failed to fetch user posts:', response.status, data);
        }
      } catch (err) {
        console.error('CompleteProfile useEffect (Posts Fetch): Error fetching user posts:', err);
        setPostsErrorMessage('An error occurred while fetching your posts. Check network or server logs.');
      } finally {
        setPostsLoading(false);
      }
    };
    if (user) { 
      fetchUserPosts();
    }
  }, [user]);

  // --- Handlers for profile form ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData({ ...profileFormData, [name]: value });
    setProfileErrorMessage('');
    setProfileSuccessMessage('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileErrorMessage('');
    setProfileSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/profile/complete', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profileFormData.fullName,
          bio: profileFormData.bio,
          skillsOffered: profileFormData.skillsOffered.split(',').map(s => s.trim()).filter(s => s),
          skillsNeeded: profileFormData.skillsNeeded.split(',').map(s => s.trim()).filter(s => s),
          discordHandle: profileFormData.discordHandle,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfileSuccessMessage(data.message || 'Profile updated successfully!');
        
        const updatedUser = { 
            ...user, 
            ...data.user, 
            profileComplete: true 
        };
        login(token, updatedUser); 
        
        setTimeout(() => setProfileSuccessMessage(''), 3000);

      } else {
        console.error('Profile update failed (backend response):', response.status, data);
        setProfileErrorMessage(data.message || `Failed to update profile. Status: ${response.status}.`);
      }
    } catch (err) {
      console.error('Profile update error (frontend/network/parsing):', err);
      setProfileErrorMessage(`An error occurred. Please try again. Details: ${err.message || err.toString()}`);
    } finally {
      setProfileLoading(false);
    }
  };

  // --- Handlers for post actions (Update Status, Delete) ---
  const handleStatusChange = async (postId, newStatus) => {
    // Show a confirmation dialog (replace with a custom modal in production)
    if (!window.confirm(`Are you sure you want to change the status of this post to "${newStatus}"?`)) {
      return;
    }

    setIsEditingStatus(prev => ({ ...prev, [postId]: true })); // Disable select for this post
    setPostsErrorMessage(''); // Clear previous post errors

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: Authentication token missing for status update.');
      setPostsErrorMessage('You must be logged in to update post status.');
      setIsEditingStatus(prev => ({ ...prev, [postId]: false }));
      navigate('/login');
      return;
    }

    try {
      console.log(`Attempting to update status for post ${postId} to ${newStatus}`);
      const response = await fetch(`http://localhost:5000/api/skills/${postId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post status updated successfully:', data.message, data.post);
        // Use the 'post' object returned by the backend to update state for perfect sync
        setUserPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId ? { ...data.post } : post // Use data.post for the updated item
          )
        );
        // Temporarily display success message
        setPostsErrorMessage(`Success: ${data.message || 'Post status updated.'}`);
        setTimeout(() => setPostsErrorMessage(''), 2000); // Clear after 2 seconds

      } else {
        console.error('Update status failed (backend response):', response.status, data);
        setPostsErrorMessage(data.message || `Failed to update post status. Status: ${response.status}.`);
        // Revert UI if update failed (optional, but good UX)
        // You'd need to store the original status before changing it to revert.
      }
    } catch (err) {
      console.error('Update status error (frontend/network):', err);
      setPostsErrorMessage(`An error occurred while updating post status. Details: ${err.message || err.toString()}`);
    } finally {
      setIsEditingStatus(prev => ({ ...prev, [postId]: false })); // Re-enable select
    }
  };

  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`)) {
      return;
    }

    setPostsErrorMessage(''); // Clear previous errors

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: Authentication token missing for delete.');
      setPostsErrorMessage('You must be logged in to delete posts.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/skills/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post deleted successfully:', data.message);
        setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        // Temporarily display success message
        setPostsErrorMessage(`Success: ${data.message || 'Post deleted.'}`);
        setTimeout(() => setPostsErrorMessage(''), 2000);

      } else {
        console.error('Delete post failed (backend response):', response.status, data);
        setPostsErrorMessage(data.message || `Failed to delete post. Status: ${response.status}.`);
      }
    } catch (err) {
      console.error('Delete post error (frontend/network):', err);
      setPostsErrorMessage(`An error occurred while deleting the post. Details: ${err.message || err.toString()}`);
    }
  };


  if (profileLoading && !profileSuccessMessage && !profileErrorMessage) {
    return (
      <div className="complete-profile-page loading-state">
        <div className="loading-message-box">
          <p className="loading-text">Loading profile data... Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="complete-profile-page">
      {/* Profile Edit Form */}
      <div className="complete-profile-form-container">
        <h2 className="form-title">Complete / Edit Your Profile</h2>
        
        {profileErrorMessage && (
          <div className="error-message" role="alert">
            <span>{profileErrorMessage}</span>
          </div>
        )}
        {profileSuccessMessage && (
          <div className="success-message" role="alert">
            <span>{profileSuccessMessage}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={profileFormData.fullName}
              onChange={handleProfileChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio" className="form-label">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profileFormData.bio}
              onChange={handleProfileChange}
              rows="3"
              className="form-textarea"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="discordHandle" className="form-label">
              Discord Handle (Optional)
            </label>
            <input
              type="text"
              id="discordHandle"
              name="discordHandle"
              value={profileFormData.discordHandle}
              onChange={handleProfileChange}
              className="form-input"
              placeholder="e.g., yourusername#1234 or your.new.username"
            />
            <p className="form-help-text">
                Enter your Discord username. (e.g., `SkillSwapUser#1234` for old handles or `skillswap.user` for new handles). This helps others contact you.
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="skillsOffered" className="form-label">
              Skills You Can Offer (comma-separated)
            </label>
            <input
              type="text"
              id="skillsOffered"
              name="skillsOffered"
              value={profileFormData.skillsOffered} 
              onChange={handleProfileChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="skillsNeeded" className="form-label">
              Skills You Need (comma-separated)
            </label>
            <input
              type="text"
              id="skillsNeeded"
              name="skillsNeeded"
              value={profileFormData.skillsNeeded} 
              onChange={handleProfileChange}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* User Posts Section */}
      <div className="user-posts-section">
        <h2 className="section-title">Your Posted Skills</h2>
        {postsErrorMessage && ( // Display error message for posts section
          <div className="error-message" role="alert">
            <span>{postsErrorMessage}</span>
          </div>
        )}
        {postsLoading ? (
          <p className="loading-message-text">Loading your posts...</p>
        ) : userPosts.length > 0 ? (
          <div className="user-posts-grid">
            {userPosts.map(post => (
              <div key={post._id} className="user-post-card">
                <h3>{post.title}</h3>
                <p className="post-description">{post.description}</p>
                <p className="post-category">Category: {post.category}</p>
                {/* Display other details like skillsOffered/Needed from the post itself */}
                <p className="post-tags">
                    {post.type === 'offer' && post.skills && post.skills.length > 0 && (
                        post.skills.map((skill, idx) => (
                            <span key={`offer-${post._id}-${idx}`} className="skill-tag-offered">{skill}</span>
                        ))
                    )}
                    {post.type === 'request' && post.skills && post.skills.length > 0 && (
                        post.skills.map((skill, idx) => (
                            <span key={`request-${post._id}-${idx}`} className="skill-tag-needed">{skill}</span>
                        ))
                    )}
                </p>

                <p className="post-status">Status: 
                  <select 
                    value={post.status} 
                    onChange={(e) => handleStatusChange(post._id, e.target.value)}
                    className="status-select"
                    disabled={isEditingStatus[post._id]} // Disable while updating
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="closed">Closed</option> {/* Added 'closed' option */}
                  </select>
                </p>
                <div className="post-actions">
                  <button 
                    onClick={() => handleDeletePost(post._id, post.title)} 
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">You haven't posted any skills yet. <Link to="/postskill">Post your first skill!</Link></p>
        )}
      </div>
    </div>
  );
};

export default CompleteProfile;
