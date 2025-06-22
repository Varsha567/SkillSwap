import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import UserProfile from './pages/UserProfile';
import Browse from './pages/Browse';
import Dashboard from './pages/Dashboard';
import PostSkill from './pages/PostSkill';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs'; 

// Import the Layout component
import Layout from './components/Layout'; 
// Import AuthProvider and useAuth from your AuthContext
import { AuthProvider, useAuth } from './context/AuthContext'; 
// Import your custom route protectors
import ProtectedRoute from './components/ProtectedRoute'; 
import PublicOnlyRoute from './components/PublicOnlyRoute'; 
import GoogleAuthCallback from './pages/GoogleAuthCallback';

// Import your CSS (if you have App.css)
import './App.css';

// A wrapper component to access AuthContext's loading state
function AppContent() {
  const { loading: authLoading, logout } = useAuth(); // Get the logout function from AuthContext

  // Add the beforeunload listener here
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('App.js: beforeunload event detected. Calling AuthContext logout.');
      logout(); // Call the logout function from AuthContext
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [logout]); // Dependency array: logout (because it's used inside the effect)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-primary-text" style={{backgroundColor: '#1A1A2E'}}>
        <p className="text-xl font-semibold">Loading application...</p>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        </Route>

        <Route path="/" element={<Layout><Dashboard /></Layout>} />
          
        <Route path="/about" element={<Layout><AboutUs /></Layout>} /> {/* NEW */}
        <Route path="/contact" element={<Layout><ContactUs /></Layout>} /> {/* NEW */}
       
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/browse" element={<Layout><Browse /></Layout>} />
          <Route path="/postskill" element={<Layout><PostSkill /></Layout>} />
          <Route path="/complete-profile" element={<Layout><CompleteProfile /></Layout>} />
          <Route path="/my-profile" element={<Layout><UserProfile /></Layout>} /> 
        </Route>

        <Route path="/profile/:userId" element={<Layout><UserProfile /></Layout>} /> 

        <Route path="*" element={<Layout><div>404: Page Not Found</div></Layout>} />
      </Routes>
    </>
  );
}

// The main App component just provides the Router and AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
