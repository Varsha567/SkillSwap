import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import UserProfile from './pages/UserProfile';
import Browse from './pages/Browse';
import Dashboard from './pages/Dashboard';
import PostSkill from './pages/PostSkill';

// Import your CSS (if you have App.css)
import './App.css';

// You might need a Header/Footer if they are part of your main layout
// import Header from './components/Header';
// import Footer from './components/Footer';

function App() {
  // State to manage authentication status globally
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to manage if the user's profile is complete
  const [profileComplete, setProfileComplete] = useState(false);
  // State to indicate if authentication status is still being loaded (e.g., from localStorage)
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Effect to check authentication status on application load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedProfileComplete = localStorage.getItem('profileComplete'); // Stored as 'true' or 'false' string

    if (token) {
      setIsAuthenticated(true);
      // Convert stored string to boolean
      setProfileComplete(storedProfileComplete === 'true');
    }
    setLoadingAuth(false); // Authentication check is complete
  }, []); // Run only once on component mount

  // Function to handle successful authentication (called by Login/Signup)
  const handleAuthSuccess = (token, isProfileComplete, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('profileComplete', isProfileComplete.toString()); // Store boolean as string
    localStorage.setItem('userId', userId); // Ensure userId is also stored
    setIsAuthenticated(true);
    setProfileComplete(isProfileComplete);
  };

  // Function to handle user logout
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('profileComplete');
  //   localStorage.removeItem('userId');
  //   setIsAuthenticated(false);
  //   setProfileComplete(false);
  //   // Optionally navigate to login or home page after logout
  //   // navigate('/login'); // If you add useNavigate here, App needs to be wrapped in BrowserRouter already
  // };

  // If still loading authentication status, show a loading indicator
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold">Loading application...</p>
      </div>
    );
  }

  // --- Protected Route Component ---
  // This is a simple inline ProtectedRoute component.
  // It checks authentication and profile completion status
  // and renders children or redirects accordingly.
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (!profileComplete) {
      // If authenticated but profile not complete, redirect to complete-profile
      // UNLESS the route trying to be accessed IS complete-profile itself
      // This logic prevents an infinite redirect loop.
      if (window.location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
      }
    }
    
    // If authenticated AND profile complete, render the children (the protected page)
    return children;
  };


  return (
    <Router>
      {/* If you have a global Header component, you can pass auth state to it */}
      {/* <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} /> */}
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          {/* Dashboard is the default landing for now. If you want a separate marketing landing, adjust this. */}
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/signup" element={<Signup onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/profile/:userId" element={<UserProfile />} /> {/* Public view of any user's profile */}
          

          {/* Authenticated and Profile Not Complete Route */}
          {/* This route specifically for completing profile. It's protected to ensure login. */}
          {/* The ProtectedRoute logic in App.js will handle redirecting here if profile isn't complete */}
          <Route 
            path="/complete-profile" 
            element={
              <ProtectedRoute>
                {/* Pass setProfileComplete to CompleteProfile so it can update App.js state */}
                <CompleteProfile onProfileComplete={() => setProfileComplete(true)} />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes (require authentication AND complete profile) */}
          {/* All routes within this <ProtectedRoute> wrapper will enforce both conditions */}
          <Route element={<ProtectedRoute />}>
              {/* Dashboard is now considered protected, accessible only if profile is complete */}
              {/* If you want the root '/' to be protected, you can move <Dashboard /> here.
                  However, based on your previous App.js, '/' was the initial dashboard.
                  Let's keep it here so only authenticated + complete profile users see it. */}
              <Route path="/dashboard" element={<Dashboard />} /> {/* Consider making '/' redirect to this */}
              <Route path="/postskill" element={<PostSkill />} />
              {/* Example of current user's profile which might have edit options */}
              <Route path="/my-profile" element={<UserProfile />} /> 
              {/* Add other protected routes here */}
              {/* <Route path="/my-swaps" element={<MySwaps />} /> */}
          </Route>

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<div className="text-center py-20 text-3xl text-red-500">404 - Page Not Found</div>} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
