import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const UserProfile = () => {
  // useParams() will capture userId from /profile/:userId route
  const { userId: paramUserId } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation(); // Get current location object
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const currentAuthUserId = localStorage.getItem('userId'); // The ID of the currently logged-in user

      // Determine the ID to fetch:
      // If we are on '/my-profile', use the currentAuthUserId.
      // If we are on '/profile/:userId', use the paramUserId.
      const idToFetch = location.pathname === '/my-profile' ? currentAuthUserId : paramUserId;

      // If no ID can be determined (e.g., not logged in and no paramId), redirect or show error
      if (!idToFetch) {
        setError('No user ID found for profile display. Please log in or provide a valid profile ID.');
        setLoading(false);
        // Optionally redirect to login if no ID is available for /my-profile
        if (location.pathname === '/my-profile') {
            navigate('/login', { replace: true });
        }
        return; // Stop execution
      }

      let url;
      // Use the /me endpoint if fetching the current authenticated user's profile
      if (token && idToFetch === currentAuthUserId && location.pathname === '/my-profile') {
        url = 'http://localhost:5000/api/profile/me'; 
      } else {
        // Otherwise, use the public /:userId endpoint
        url = `http://localhost:5000/api/profile/${idToFetch}`;
      }

      console.log('Fetching profile from URL:', url); // For debugging
      console.log('ID being fetched:', idToFetch); // For debugging

      try {
        const headers = { 'Content-Type': 'application/json' };
        // Only send Authorization header if a token exists and it's needed for the endpoint
        // The /me endpoint specifically requires a token. Public profiles might not.
        if (token && (url.endsWith('/me') || (location.pathname.startsWith('/profile/') && idToFetch === currentAuthUserId))) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (response.ok) {
          setProfile(data);
          console.log('Profile data fetched successfully:', data); // For debugging
        } else {
          setError(data.message || 'Failed to fetch profile');
          console.error('Failed to fetch profile (backend response):', data); // For debugging
          // Handle specific errors like 404 for profile not found
          if (response.status === 404) {
              setProfile(null); // Explicitly set profile to null if not found
          }
        }
      } catch (err) {
        console.error('Error fetching profile (frontend/network issue):', err); // More specific console error
        setError('An error occurred while fetching profile data. Please check your network and backend.');
      } finally {
        setLoading(false);
      }
    };

    // Re-fetch when the path changes or the paramUserId changes
    // FIX: Removed 'currentAuthUserId' from dependency array
    fetchUserProfile();
  }, [paramUserId, location.pathname, navigate]); // Dependencies adjusted

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // This condition handles cases where no profile is found or ID is invalid
  if (!profile) {
    return <div className="text-center py-8">Profile not found or invalid ID.</div>;
  }

  // Determine if it's the current user's profile to conditionally show sensitive info/edit options
  // This line (Line 80 in your original code) remains unchanged as it correctly accesses localStorage directly.
  const isCurrentUserProfile = (localStorage.getItem('token') && profile._id === localStorage.getItem('userId'));


  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center mb-6">
          {/* You can add a profile picture here */}
          <img
            src="https://placehold.co/150x150/ADD8E6/000000?text=Profile" // More descriptive placeholder
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full mr-6 border-2 border-blue-500"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{profile.fullName || profile.username || 'User'}</h1>
            {/* Only show email if it's their own profile */}
            {isCurrentUserProfile && (
              <p className="text-gray-600 text-lg">{profile.email}</p>
            )}
            {/* Optional: Add an edit profile button here if it's the current user's profile */}
            {isCurrentUserProfile && (
                <button
                    onClick={() => navigate('/edit-profile')} // You'd create an /edit-profile route/page later
                    className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded-full text-sm"
                >
                    Edit Profile
                </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">About Me</h2>
          <p className="text-gray-800">{profile.bio || 'No bio provided yet.'}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Skills Offered</h2>
          {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skillsOffered.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No skills offered yet.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Skills Needed</h2>
          {profile.skillsNeeded && profile.skillsNeeded.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skillsNeeded.map((skill, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No skills needed yet.</p>
          )}
        </div>

        {/* Placeholder for Skill Listings */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Skill Listings by {profile.username || profile.fullName || 'this user'}</h2>
          {/* You will fetch and render SkillListing components here later */}
          <div className="bg-gray-50 p-4 rounded-md text-gray-600">
            (Coming soon: Display skill offers and requests by this user)
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
