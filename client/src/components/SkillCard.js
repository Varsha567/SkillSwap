import React,{useEffect}from 'react';
import { Link } from 'react-router-dom';
import '../css/SkillCard.css'; // NEW: Import dedicated CSS for SkillCard

const SkillCard = ({ skill }) => {
     useEffect(() => {
     const skillCards = document.querySelectorAll('.skill-card');
     const observer = new IntersectionObserver((entries) => {
       entries.forEach((entry, index) => {
         if (entry.isIntersecting) {
           entry.target.style.setProperty('--animation-order', index);
           entry.target.classList.add('animated');
         }
       });
     }, { threshold: 0.1 });
     
     skillCards.forEach(card => observer.observe(card));
   }, []);
  if (!skill) {
    return <div className="skill-card-placeholder">No skill data available.</div>;
  }

  // Ensure skill.username and skill.userId exist before trying to render
  const posterInfo = skill.username && skill.userId ? (
    <Link to={`/profile/${skill.userId}`} className="skill-card-username">
      {skill.username}
    </Link>
  ) : (
    <span className="skill-card-username">Anonymous User</span> // Fallback for missing data
  );

  return (
    <div className="skill-card">
      <h3 className="skill-card-title">{skill.title}</h3>
      <p className="skill-card-category">{skill.category}</p>
      <p className="skill-card-description">{skill.description}</p>
      <div className="skill-card-details">
        <span className="skill-card-level">{skill.skillLevel}</span>
        <span className="skill-card-swapfor">Swap for: {skill.swapFor}</span>
      </div>
      <div className="skill-card-footer">
        Posted by: {posterInfo}
        <span className="skill-card-date">
          {skill.createdAt ? new Date(skill.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default SkillCard;
