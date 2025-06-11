import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SkillCard from '../components/SkillCard';
import '../css/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const skills = [
    { id: 1, title: 'UI Design', user: 'Alex', swapFor: 'Photography', category: '🎨 Design' },
    { id: 2, title: 'React Tutoring', user: 'Sam', swapFor: 'Copywriting', category: '💻 Programming' }
  ];
  
  const testimonials = [
    { id: 1, text: "Thanks to SkillSwap, I learned French while teaching web dev!", author: "Aisha, 22" }
  ];

 

  return React.createElement(
    'div',
    { className: 'dashboard-container' },

    React.createElement(Header, { isLoggedIn: false }),

    // Hero Section
    React.createElement(
      'section',
      { className: 'hero-section' },
      React.createElement(
        'div',
        { className: 'hero-content' },
        React.createElement('h1', null, 'Swap Skills. Grow Together.'),
        React.createElement('p', { className: 'hero-subtext' }, 'Exchange skills with people around the world. No money. Just knowledge.'),
        React.createElement(
          'div',
          { className: 'hero-buttons' },
          React.createElement(
            'button',
            { className: 'btn-primary', onClick: () => navigate('/signup') },
            'Get Started'
          ),
          React.createElement(
            'button',
            { className: 'btn-secondary', onClick: () => navigate('/browse') },
            'Browse Skills'
          )
        )
        
      )
    ),

    // How It Works Section
    React.createElement(
      'section',
      { className: 'how-it-works' },
      React.createElement('h2', null, 'How It Works'),
      React.createElement(
        'div',
        { className: 'steps-container' },
        ['Sign up', 'Post your skills', 'Get matched', 'Start swapping'].map((step, index) =>
          React.createElement(
            'div',
            { key: index, className: 'step-card' },
            React.createElement('h3', null, step)
          )
        )
      )
    ),

    // Featured Skills Section
    React.createElement(
      'section',
      { className: 'featured-skills' },
      React.createElement('h2', null, 'Recently Posted Skills'),
      React.createElement(
        'div',
        { className: 'skills-grid' },
        skills.length > 0
          ? skills.map((skill) =>
              React.createElement(SkillCard, { key: skill.id, skill })
            )
          : React.createElement(
              'p',
              { style: { color: 'white' } },
              'No skills posted yet. Be the first to ',
              React.createElement(
                'a',
                { href: '/post-skill', style: { color: '#EE7C53' } },
                'post a skill'
              ),
              '!'
            )
      )
    ),

    // Testimonials Section
    React.createElement(
      'section',
      { className: 'testimonials' },
      React.createElement('h2', null, 'Success Stories'),
      React.createElement(
        'div',
        { className: 'testimonial-carousel' },
        testimonials.length > 0
          ? testimonials.map((t) =>
              React.createElement(
                'div',
                { key: t.id, className: 'testimonial-card' },
                React.createElement('p', { className: 'quote' }, `"${t.text}"`),
                React.createElement('p', { className: 'author' }, `- ${t.author}`)
              )
            )
          : React.createElement('p', null, 'No testimonials yet.')
      )
    ),

    // Footer
    React.createElement(
      'footer',
      { className: 'main-footer' },
      React.createElement('p', null, '© 2025 SkillSwap. All rights reserved.')
    )
  );
};

export default Dashboard;
