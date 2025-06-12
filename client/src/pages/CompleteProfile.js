import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';

const CompleteProfile = ({ onProfileComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    // FIX: Initialize skillsOffered and skillsNeeded as empty strings
    // The input fields will directly control these string values.
    skillsOffered: '', // Initialize as an empty string
    skillsNeeded: '',  // Initialize as an empty string
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Optional: Fetch existing profile data if user revisits this page or partially filled
  useEffect(() => {
    const fetchExistingProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data) {
          setFormData({
            fullName: data.fullName || '',
            bio: data.bio || '',
            // FIX: Convert fetched arrays to comma-separated strings for input fields
            skillsOffered: Array.isArray(data.skillsOffered) ? data.skillsOffered.join(', ') : '',
            skillsNeeded: Array.isArray(data.skillsNeeded) ? data.skillsNeeded.join(', ') : '',
          });
        }
      } catch (err) {
        console.error('Error fetching existing profile:', err);
        // Do not block if profile fetch fails, user can still fill form
      }
    };
    fetchExistingProfile();
  }, []); // Run once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    // This general handleChange works for all fields, storing the input value as a string.
    setFormData({ ...formData, [name]: value });
    setErrorMessage(''); // Clear error on input change
    setSuccessMessage(''); // Clear success on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect if not authenticated
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
          fullName: formData.fullName,
          bio: formData.bio,
          // When sending to backend, convert the comma-separated string from the input
          // into an array, then trim each item and filter out empty strings.
          skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(s => s),
          skillsNeeded: formData.skillsNeeded.split(',').map(s => s.trim()).filter(s => s),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Profile completed successfully!');
        localStorage.setItem('profileComplete', 'true'); // Update localStorage
        onProfileComplete(); // Update App.js state
        // Give a brief moment for success message to show, then navigate
        setTimeout(() => {
          navigate('/'); // Redirect to dashboard after profile is complete
        }, 1500); // 1.5 seconds delay
      } else {
        setErrorMessage(data.message || 'Failed to complete profile');
        console.error('Profile completion failed (backend response):', data);
      }
    } catch (err) {
      console.error('Profile completion error (frontend/network):', err);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="skillsOffered" className="block text-gray-700 text-sm font-bold mb-2">
              Skills You Can Offer (comma-separated)
            </label>
            <input
              type="text"
              id="skillsOffered"
              name="skillsOffered"
              // FIX: Directly use formData.skillsOffered as value. It will be a string.
              value={formData.skillsOffered} 
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="skillsNeeded" className="block text-gray-700 text-sm font-bold mb-2">
              Skills You Need (comma-separated)
            </label>
            <input
              type="text"
              id="skillsNeeded"
              name="skillsNeeded"
              // FIX: Directly use formData.skillsNeeded as value. It will be a string.
              value={formData.skillsNeeded} 
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
