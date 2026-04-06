import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import './MovieRow.css';

const MovieRow = ({ title, movies = [], loading = false }) => {
  const rowRef = useRef(null);
  const { isBookmarked, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 350, behavior: 'smooth' });
    }
  };

  if (!loading && movies.length === 0) return null;

  return (
    <section className="movie-row-section">
      <h2 className="row-title">{title}</h2>
      <div className="row-wrapper">
        <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left">
          <ChevronLeft size={24} />
        </button>

        <div className="row-track" ref={rowRef}>
          {loading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="row-card-skeleton skeleton"></div>
              ))
            : movies.map((movie, index) => {
                const poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/200x300?text=No+Poster' : movie.Poster;
                const bookmarked = isBookmarked(movie.imdbID);
                return (
                  <div key={`${movie.imdbID}-${index}`} className="row-card">
                    <Link to={`/movie/${movie.imdbID}`} className="row-card-link">
                      <img
                        src={poster}
                        alt={movie.Title}
                        loading="lazy"
                        className="row-poster"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://placehold.co/200x300/1f1f1f/888?text=${encodeURIComponent(movie.Title || 'No Poster')}`;
                        }}
                      />
                      <div className="row-card-info">
                        <span className="row-card-title">{movie.Title}</span>
                        <span className="row-card-year">{movie.Year}</span>
                      </div>
                    </Link>
                    <button
                      className={`row-bookmark ${bookmarked ? 'active' : ''}`}
                      onClick={() => bookmarked ? removeFromWatchlist(movie.imdbID) : addToWatchlist(movie)}
                      title={bookmarked ? 'Remove from Watchlist' : 'Save to Watchlist'}
                    >
                      <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                );
              })}
        </div>

        <button className="row-arrow right" onClick={() => scroll(1)} aria-label="Scroll right">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;
