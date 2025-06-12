import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Signup = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // Add username field
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // IMPORTANT FIX: This handleChange function now correctly accepts 'name' and 'value'
  // as passed by your AuthForm component.
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear error message on new submission

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        localStorage.setItem('userId', data.userId); // Store userId on signup too
        // New user's profile is *not* complete by default
        onAuthSuccess(data.token, false); // Pass false for profileComplete
        navigate('/complete-profile'); // Redirect to profile completion
      } else {
        console.error('Signup failed (backend response):', data.message || 'Unknown error');
        setErrorMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error (frontend/network):', err);
      setErrorMessage('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Join SkillSwap</h2>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <AuthForm
          isLogin={false}
          formData={formData}
          handleChange={handleChange} // Pass the corrected handleChange
          onSubmit={handleSubmit}
        />
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
