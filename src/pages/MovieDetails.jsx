import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, fetchMovies } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { useReviews } from '../context/ReviewsContext';
import { useCustomLists } from '../context/CustomListsContext';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import CastCard from '../components/CastCard';
import MovieRow from '../components/MovieRow';
import StarRating from '../components/StarRating';
import { Clock, Star, Award, PlayCircle, MonitorPlay, ArrowLeft, Bookmark, ListPlus, Send } from 'lucide-react';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [pendingRating, setPendingRating] = useState(0);
  const [showListModal, setShowListModal] = useState(false);

  const { isBookmarked, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { getReview, saveReview } = useReviews();
  const { lists, addMovieToList, removeMovieFromList, isInList } = useCustomLists();

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id);
        if (data.Response === 'True') {
          setMovie(data);
          // Load similar movies from first genre
          const firstGenre = data.Genre !== 'N/A' ? data.Genre.split(',')[0].trim() : 'action';
          const similar = await fetchMovies(firstGenre);
          setSimilarMovies(similar.Response === 'True' ? similar.Search.filter(m => m.imdbID !== id).slice(0, 10) : []);
        } else {
          setError(data.Error);
        }
      } catch { setError('Failed to fetch movie details.'); }
      finally { setLoading(false); }
    };
    loadMovie();
  }, [id]);

  // Populate existing review on load
  useEffect(() => {
    if (movie) {
      const existing = getReview(movie.imdbID);
      if (existing) {
        setPendingRating(existing.rating || 0);
        setReviewText(existing.text || '');
      }
    }
  }, [movie]);

  if (loading) return (
    <div className="page-wrapper" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }}></div>
      </div>
    </div>
  );

  if (error || !movie) return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate(-1)} className="btn btn-glass" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    </div>
  );

  const bookmarked = isBookmarked(movie.imdbID);
  const poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/400x600?text=No+Poster' : movie.Poster;
  const existingReview = getReview(movie.imdbID);
  const actors = movie.Actors !== 'N/A' ? movie.Actors.split(', ') : [];

  const handleWatchlistToggle = () => {
    if (!user) { navigate('/login'); return; }
    if (bookmarked) removeFromWatchlist(movie.imdbID);
    else addToWatchlist({ imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Type: movie.Type, Poster: movie.Poster, Genre: movie.Genre, Runtime: movie.Runtime });
  };

  const handleSubmitReview = () => {
    if (!user) { navigate('/login'); return; }
    if (!pendingRating) return;
    saveReview(movie.imdbID, { rating: pendingRating, text: reviewText, title: movie.Title, poster: movie.Poster, year: movie.Year });
  };

  return (
    <div className="page-wrapper detail-page">
      <Navbar />
      <div className="detail-backdrop" style={{ backgroundImage: `url(${poster})` }}></div>
      <div className="detail-backdrop-overlay"></div>

      <main className="container detail-content animate-fade-in">
        <button onClick={() => navigate(-1)} className="back-btn"><ArrowLeft size={24} /></button>

        <div className="detail-grid">
          {/* LEFT COLUMN */}
          <div className="detail-poster-col">
            <img src={poster} alt={movie.Title} className="detail-poster" />
            <button className={`btn-watchlist-large ${bookmarked ? 'active' : ''}`} onClick={handleWatchlistToggle}>
              <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
              {bookmarked ? 'Saved to Watchlist' : 'Save to Watch Later'}
            </button>
            <button className="btn-watchlist-large" onClick={() => user ? setShowListModal(true) : navigate('/login')}>
              <ListPlus size={20} /> Add to Custom List
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="detail-info-col">
            <h1 className="detail-title">{movie.Title}</h1>

            <div className="detail-meta">
              <span className="meta-item"><Clock size={16} /> {movie.Runtime}</span>
              <span className="meta-item"><Star size={16} color="gold" fill="gold" /> {movie.imdbRating}/10</span>
              {movie.imdbVotes !== 'N/A' && <span className="meta-item">{Number(movie.imdbVotes.replace(/,/g, '')).toLocaleString()} votes</span>}
              <span className="meta-item badge">{movie.Rated}</span>
              <span className="meta-item">{movie.Year}</span>
            </div>

            <div className="detail-genres">
              {movie.Genre !== 'N/A' && movie.Genre.split(', ').map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>

            <p className="detail-plot">{movie.Plot}</p>

            <div className="detail-crew">
              <div className="crew-item"><span className="crew-label">Director</span><span className="crew-value">{movie.Director}</span></div>
              <div className="crew-item"><span className="crew-label">Writer</span><span className="crew-value">{movie.Writer}</span></div>
              <div className="crew-item"><span className="crew-label">Language</span><span className="crew-value">{movie.Language}</span></div>
              <div className="crew-item"><span className="crew-label">Country</span><span className="crew-value">{movie.Country}</span></div>
            </div>

            {movie.Awards !== 'N/A' && (
              <div className="detail-awards glass">
                <Award size={22} color="var(--color-primary)" />
                <p>{movie.Awards}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="detail-actions">
              <button className="btn btn-primary" onClick={() => setShowTrailer(true)}>
                <PlayCircle size={20} /> Watch Trailer
              </button>
              <button className="btn btn-glass" onClick={() => window.open(`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.Title)}`, '_blank')}>
                <MonitorPlay size={20} /> Where to Watch
              </button>
            </div>

            {/* ---- CAST ---- */}
            {actors.length > 0 && (
              <section className="detail-section">
                <h3 className="section-title">Cast</h3>
                <div className="cast-grid">
                  {actors.map(name => <CastCard key={name} name={name} />)}
                </div>
              </section>
            )}

            {/* ---- USER REVIEW ---- */}
            <section className="detail-section review-section glass">
              <h3 className="section-title">Your Review</h3>
              <StarRating value={pendingRating} onChange={setPendingRating} size={32} />
              <textarea
                className="review-textarea"
                placeholder="Write a short review... (max 280 chars)"
                maxLength={280}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
              <div className="review-footer">
                <span className="char-count">{reviewText.length}/280</span>
                <button className="btn btn-primary" onClick={handleSubmitReview} disabled={!pendingRating}>
                  <Send size={16} /> {existingReview ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
              {existingReview && (
                <div className="existing-review">
                  <p className="review-saved-label">✅ Your last review was saved</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Similar Movies Row */}
        {similarMovies.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <MovieRow title={`🎬 More Like This`} movies={similarMovies} />
          </div>
        )}
      </main>

      {/* ---- TRAILER MODAL ---- */}
      {showTrailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-content glass" onClick={e => e.stopPropagation()}>
            <button className="close-trailer" onClick={() => setShowTrailer(false)}>✕</button>
            <h3>{movie.Title} — Trailer</h3>
            <div className="trailer-video-wrapper">
              <iframe
                src={`https://www.youtube-nocookie.com/embed?search_query=${encodeURIComponent(movie.Title + ' ' + movie.Year + ' official trailer')}&listType=search`}
                title={`${movie.Title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* ---- ADD TO LIST MODAL ---- */}
      {showListModal && (
        <div className="trailer-modal" onClick={() => setShowListModal(false)}>
          <div className="list-modal-content glass" onClick={e => e.stopPropagation()}>
            <button className="close-trailer" onClick={() => setShowListModal(false)}>✕</button>
            <h3>Add to Custom List</h3>
            <div className="list-options">
              {lists.map(list => {
                const inList = isInList(list.id, movie.imdbID);
                return (
                  <button
                    key={list.id}
                    className={`list-option-btn ${inList ? 'active' : ''}`}
                    onClick={() => inList
                      ? removeMovieFromList(list.id, movie.imdbID)
                      : addMovieToList(list.id, { imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Poster: movie.Poster, Type: movie.Type })
                    }
                  >
                    {inList ? '✅' : '+'} {list.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
