import React from 'react';
import '../css/dashboard.css';

const SkillCard = ({ skill }) => {
  return (
    <div className="skill-card">
      <h3>{skill.title}</h3>
      <p>Offered by: {skill.user}</p>
      <p>Wants to swap for: {skill.swapFor}</p>
      <button className="btn-primary">Offer Swap</button>
    </div>
  );
};

export default SkillCard;