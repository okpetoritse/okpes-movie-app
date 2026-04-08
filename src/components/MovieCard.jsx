import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isBookmarked, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/300x450?text=No+Poster' : movie.Poster;
  const bookmarked = isBookmarked(movie.imdbID);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (bookmarked) {
      removeFromWatchlist(movie.imdbID);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
    const rotateY = ((x - centerX) / centerX) * 15;

    // Glare calculations
    const distanceX = Math.abs(centerX - x);
    const distanceY = Math.abs(centerY - y);
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) - 90;
    
    setTransformStyle(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    setGlareStyle({
      opacity: 0.5,
      background: `linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
      transform: `translateY(${y * 0.1}px) translateX(${x * 0.1}px)`
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle(`rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlareStyle({ opacity: 0 });
  };

  return (
    <Link 
      to={`/movie/${movie.imdbID}`} 
      className="movie-card-container"
    >
      <div 
        className="movie-card glass-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: transformStyle }}
      >
        <div className="card-glare" style={glareStyle}></div>
        <div className="movie-poster-wrapper">
          <img
            src={poster}
            alt={movie.Title}
            className="movie-poster"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = `https://placehold.co/300x450/1f1f1f/888888?text=${encodeURIComponent(movie.Title || 'No Poster')}`;
            }}
          />
          <button 
            className={`watchlist-btn ${bookmarked ? 'bookmarked' : ''}`}
            onClick={toggleWatchlist}
            title={bookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.Title}</h3>
          <div className="movie-meta">
            <span className="movie-year">{movie.Year}</span>
            <span className="movie-type">{movie.Type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
