import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm'; // Reusable form

const Login = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // State to hold potential error messages from the backend
  const [errorMessage, setErrorMessage] = useState('');

  // IMPORTANT FIX: This handleChange function now correctly accepts 'name' and 'value'
  // as passed by your AuthForm component, instead of expecting an event object 'e'.
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    // Clear any previous error message when user starts typing again
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear error message on new submission

    try {
      // Ensure the port number is correct, as specified (5000)
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Log the successful response data for debugging
        console.log('Login successful:', data);

        // Store the userId along with the token and profileComplete status
        // This userId is crucial for fetching the correct profile later
        localStorage.setItem('userId', data.userId);
        
        // Call the prop function to update App.js state and localStorage
        onAuthSuccess(data.token, data.profileComplete);

        if (data.profileComplete) {
          // If profile is complete, navigate to the dashboard
          navigate('/dashboard'); 
        } else {
          // If profile is NOT complete, navigate to the profile completion page
          navigate('/complete-profile');
        }
      } else {
        // If response is not OK (e.g., 401, 400), display the error message from the backend
        console.error('Login failed (backend response):', data.message || 'Unknown error');
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Catch network errors or issues with JSON parsing
      console.error('Login error (frontend/network):', err);
      setErrorMessage('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to SkillSwap</h2>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <AuthForm
          isLogin={true}
          formData={formData}
          handleChange={handleChange} // Pass the corrected handleChange
          onSubmit={handleSubmit}
        />
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
