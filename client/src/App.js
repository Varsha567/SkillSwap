import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import Browse from './pages/Browse';
import './App.css';
import Dashboard from './pages/Dashboard';
import PostSkill from './pages/PostSkill';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/browse" element={<Browse/>}/>
        <Route path="/postskill" element={<PostSkill/>}/>
        
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;