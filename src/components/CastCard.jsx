import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CastCard.css';

const CastCard = ({ name }) => {
  const navigate = useNavigate();
  // Generate avatar using UI Avatar service (free, no API key)
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=1F1F1F&color=E50914&bold=true&format=png`;

  const handleClick = () => {
    navigate(`/browse?q=${encodeURIComponent(name)}`);
  };

  return (
    <button className="cast-card" onClick={handleClick} title={`Search movies with ${name}`}>
      <div className="cast-avatar-wrapper">
        <img
          src={avatarUrl}
          alt={name}
          className="cast-avatar"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="cast-avatar-fallback" style={{ display: 'none' }}>
          {initials}
        </div>
      </div>
      <span className="cast-name">{name}</span>
    </button>
  );
};

export default CastCard;
