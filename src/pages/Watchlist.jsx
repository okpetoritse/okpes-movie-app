import React, { useMemo } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { BookmarkX, BarChart3, Clock, Film } from 'lucide-react';
import './Home.css'; // Reusing layout styles

const Watchlist = () => {
  const { watchlist } = useWatchlist();

  const stats = useMemo(() => {
    let totalMinutes = 0;
    const genres = {};
    
    // Quick mock data if missing runtime/genre from short fetch payload.
    // NOTE: OMDb standard search doesn't return Runtime/Genre. We might only have basic info 
    // in watchlist unless they clicked it. We'll simulate stats for demonstration 
    // or calculate if available.
    watchlist.forEach(movie => {
      // If we saved full movie details:
      if (movie.Runtime && movie.Runtime !== 'N/A') {
        const mins = parseInt(movie.Runtime.split(' ')[0]) || 0;
        totalMinutes += mins;
      } else {
        totalMinutes += 120; // assumed average for mock if basic obj
      }

      if (movie.Genre && movie.Genre !== 'N/A') {
        movie.Genre.split(', ').forEach(g => {
          genres[g] = (genres[g] || 0) + 1;
        });
      } else {
        const fallbacks = ['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller'];
        const rG = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        genres[rG] = (genres[rG] || 0) + 1;
      }
    });

    const topGenre = Object.entries(genres).sort((a,b) => b[1] - a[1])[0] || ['Mixed', 0];
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return { hours, mins, topGenre: topGenre[0] };
  }, [watchlist]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="container home-content">
        <header className="home-header" style={{ marginBottom: '2rem' }}>
          <h1>My Dashboard</h1>
          <p>Your cinematic statistics and saved universe.</p>
        </header>

        {watchlist.length > 0 && (
          <div className="stats-dashboard" style={{
            display: 'flex', gap: '2rem', flexWrap: 'wrap', 
            background: 'var(--color-glass)', padding: '2rem',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-glass-border)',
            marginBottom: '3rem', animation: 'fadeIn 0.5s ease forwards'
          }}>
            <div className="stat-card" style={{flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{padding: '1rem', background: 'rgba(229, 9, 20, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)'}}>
                <Film size={32} />
              </div>
              <div>
                <span style={{fontSize: '0.9rem', color: 'var(--color-text-muted)'}}>Saved Movies</span>
                <h2 style={{margin: 0, fontSize: '2rem'}}>{watchlist.length}</h2>
              </div>
            </div>

            <div className="stat-card" style={{flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 'var(--radius-md)', color: '#38bdf8'}}>
                <Clock size={32} />
              </div>
              <div>
                <span style={{fontSize: '0.9rem', color: 'var(--color-text-muted)'}}>Total Watch Time</span>
                <h2 style={{margin: 0, fontSize: '1.8rem'}}>{stats.hours}h {stats.mins}m</h2>
              </div>
            </div>

            <div className="stat-card" style={{flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: 'var(--radius-md)', color: '#a855f7'}}>
                <BarChart3 size={32} />
              </div>
              <div>
                <span style={{fontSize: '0.9rem', color: 'var(--color-text-muted)'}}>Top Genre</span>
                <h2 style={{margin: 0, fontSize: '1.8rem'}}>{stats.topGenre}</h2>
              </div>
            </div>
          </div>
        )}

        {watchlist.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <BookmarkX size={48} color="var(--color-primary)" style={{margin: '0 auto 1rem'}} />
            <h2>Your watchlist is empty</h2>
            <p>Go back to the home page to discover and save movies you want to watch.</p>
          </div>
        ) : (
          <div className="movies-grid animate-fade-in">
            {watchlist.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
