import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../context/AuthContext';
import '../css/UserProfile.css'; // Assume your UserProfile specific CSS
import '../css/SkillCard.css'; // For individual skill card styling if not in UserProfile.css

const UserProfile = () => {
  const { userId: paramUserId } = useParams(); // Get userId from URL params (e.g., from /profile/:userId)
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth(); // Get logged-in user and auth loading status

  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]); // State to store user's skill posts
  const [loadingProfile, setLoadingProfile] = useState(true); // Loading state for profile data
  const [loadingPosts, setLoadingPosts] = useState(true);   // Loading state for posts data
  const [profileError, setProfileError] = useState('');     // Error for profile fetch
  const [postsError, setPostsError] = useState('');         // Error for posts fetch
  const [copySuccess, setCopySuccess] = useState('');       // State for copy success message

  // Determine if the currently viewed profile belongs to the logged-in user
  // This uses paramUserId for /profile/:userId and authUser._id for /my-profile
  const isCurrentUserProfile = authUser && (paramUserId === authUser._id || window.location.pathname === '/my-profile');

  // --- Effect to fetch User Profile Data ---
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoadingProfile(true);
      setProfileError('');
      setLoadingPosts(true);
      setPostsError('');

      const idToFetch = paramUserId || authUser?._id; // Prioritize paramId, fallback to authUser for /my-profile

      if (!idToFetch && !authLoading) { // If no ID and auth is done loading, redirect if it's /my-profile
          setProfileError('No user ID found for profile display. Please log in or provide a valid profile ID.');
          if (window.location.pathname === '/my-profile' && !authUser) { // Only redirect if specifically /my-profile and not logged in
              navigate('/login', { replace: true });
          }
          setLoadingProfile(false);
          setLoadingPosts(false);
          return;
      }
      
      // If auth is still loading, or no ID resolved, wait.
      if (authLoading || !idToFetch) {
          return;
      }

      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        // Fetch User Profile
        const profileUrl = isCurrentUserProfile ? `${process.env.REACT_APP_BACKEND_URL}/api/profile/me` : `${process.env.REACT_APP_BACKEND_URL}/api/profile/${idToFetch}`;
        const profileResponse = await fetch(profileUrl, { headers });
        const profileData = await profileResponse.json();

        if (profileResponse.ok) {
          setProfile(profileData);
        } else {
          setProfileError(profileData.message || 'Failed to fetch profile');
          if (profileResponse.status === 404) {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('Error fetching profile (frontend/network issue):', err);
        setProfileError('An error occurred while fetching profile data. Please check your network and backend.');
      } finally {
        setLoadingProfile(false);
      }

      // Fetch User Posts
      try {
        const postsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/skills/user/${idToFetch}`, { headers });
        const postsData = await postsResponse.json();

        if (postsResponse.ok && postsData.listings) {
          setUserPosts(postsData.listings);
        } else {
          setPostsError(postsData.message || `Failed to fetch user's skills. Status: ${postsResponse.status}`);
          console.error('UserProfile: Failed to fetch user posts:', postsResponse.status, postsData);
        }
      } catch (err) {
        console.error('UserProfile: Error fetching user posts:', err);
        setPostsError('An error occurred while loading user posts.');
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProfileAndPosts();
  }, [paramUserId, authUser, authLoading, navigate, isCurrentUserProfile]); // Added isCurrentUserProfile to dependencies for profile URL logic

  // Function to copy discord handle to clipboard
  const copyDiscordHandle = () => {
    if (profile && profile.discordHandle) {
      const el = document.createElement('textarea');
      el.value = profile.discordHandle;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
    }
  };

  // --- Render Loading / Error States ---
  if (loadingProfile || loadingPosts) { // Show loading until both profile and posts are fetched
    return (
      <div className="user-profile-page loading-state">
        <div className="loading-message-box">
          <p className="loading-text">Loading profile and listings...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="user-profile-page error-state">
        <div className="error-message-box">
          <p className="error-text">{profileError}</p>
        </div>
      </div>
    );
  }

  if (!profile) { // If profile not found after loading
    return <div className="user-profile-page error-state">
        <div className="error-message-box">
            <p className="error-text">Profile not found or invalid ID.</p>
        </div>
    </div>;
  }

  // --- Main Render for User Profile and Posts ---
  return (
    <div className="user-profile-page">
      <div className="profile-card"> {/* Renamed profile-header to profile-card for consistency */}
        <h2 className="profile-name">
          {profile.fullName || profile.username || 'User Profile'}
          {isCurrentUserProfile && <span className="own-profile-indicator">(Your Profile)</span>}
        </h2>
        {/* Profile incomplete warning and link to complete profile */}
        {isCurrentUserProfile && profile.profileComplete === false && (
          <div className="profile-incomplete-warning">
            Your profile is incomplete. <Link to="/complete-profile">Complete it now!</Link>
          </div>
        )}
        <p className="profile-bio">{profile.bio || 'No bio provided yet.'}</p>
        
        {profile.discordHandle && (
          <p className="profile-detail discord-handle-display">
            Discord: {profile.discordHandle} 
            <button onClick={copyDiscordHandle} className="copy-button">
              {copySuccess || 'Copy'}
            </button>
          </p>
        )}
        {profile.skillsOffered && profile.skillsOffered.length > 0 && (
          <p className="profile-detail">Skills Offered: {profile.skillsOffered.join(', ')}</p>
        )}
        {profile.skillsNeeded && profile.skillsNeeded.length > 0 && (
          <p className="profile-detail">Skills Needed: {profile.skillsNeeded.join(', ')}</p>
        )}
        
        {/* Edit Profile button, ONLY shown for the current user's own profile */}
        {isCurrentUserProfile && (
          <button
            onClick={() => navigate('/complete-profile')}
            className="edit-profile-button"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* User's Posts Section (No "Coming soon" box) */}
      <div className="user-posts-section">
        <h3 className="section-title">Skill Listings by {profile.username || profile.fullName || 'this user'}</h3>
        {postsError && (
          <div className="error-message-text">{postsError}</div>
        )}
        {loadingPosts ? (
          <p className="loading-message-text">Loading skill listings...</p>
        ) : userPosts.length > 0 ? (
          <div className="user-posts-grid">
            {userPosts.map(post => (
              <div key={post._id} className="user-post-card">
                <h4>{post.title}</h4>
                <p className="post-description">{post.description}</p>
                <p className="post-category">Category: {post.category}</p>
                <p className="post-level">Level: {post.skillLevel}</p>
                <p className="post-swap-for">Seeking: {post.swapFor}</p>
                <p className="post-status">Status: <span>{post.status}</span></p>
                {/* No edit/delete buttons here as requested */}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">
            {isCurrentUserProfile 
                ? <>You haven't posted any skills yet. <Link to="/postskill">Post your first skill!</Link></>
                : 'This user has no public skill listings.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
