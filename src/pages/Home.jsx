import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchMovies } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MovieRow from '../components/MovieRow';
import FilterBar from '../components/FilterBar';
import { SlidersHorizontal, X } from 'lucide-react';
import './Home.css';

// ── Row definitions ────────────────────────────────────────────────────────

const GENRE_ROWS = [
  { label: '🔥 Action & Adventure', terms: ['action', 'war', 'hero'],        type: 'movie' },
  { label: '💫 Drama',              terms: ['drama', 'life', 'story'],        type: 'movie' },
  { label: '❤️ Romance',            terms: ['love', 'romance', 'heart'],      type: 'movie' },
  { label: '🚀 Sci-Fi & Fantasy',   terms: ['space', 'future', 'alien'],      type: 'movie' },
  { label: '😂 Comedy',             terms: ['comedy', 'funny', 'laugh'],      type: 'movie' },
  { label: '🌸 Animation',          terms: ['animated', 'animation', 'kids'], type: 'movie' },
  { label: '😱 Horror & Thriller',  terms: ['horror', 'thriller', 'dark'],    type: 'movie' },
  { label: '🦸 Superhero',          terms: ['marvel', 'superhero', 'batman'], type: 'movie' },
];

const MOVIE_YEAR_ROWS = [
  { label: '🔥 Recent Releases 2026', year: '2026', terms: ['love', 'man', 'war', 'city'] },
  { label: '🎬 Best Movies of 2025',  year: '2025', terms: ['love', 'man', 'war', 'dark'] },
  { label: '🎬 Best Movies of 2024',  year: '2024', terms: ['love', 'man', 'war', 'rise'] },
  { label: '🎬 Best Movies of 2023',  year: '2023', terms: ['love', 'man', 'war', 'world']},
  { label: '🎬 Best Movies of 2022',  year: '2022', terms: ['love', 'man', 'war', 'night']},
  { label: '🎬 Best Movies of 2021',  year: '2021', terms: ['love', 'man', 'black', 'rise']},
  { label: '🎬 Best Movies of 2020',  year: '2020', terms: ['love', 'man', 'dark', 'blood']},
  { label: '📼 2010s Classics',       year: '2015', terms: ['love', 'man', 'dark', 'rise']},
  { label: '📼 2000s Favourites',     year: '2005', terms: ['love', 'man', 'dark', 'blood']},
];

const SERIES_YEAR_ROWS = [
  { label: '📺 Top Series of 2026', year: '2026', terms: ['love', 'dark', 'man', 'night'] },
  { label: '📺 Top Series of 2025', year: '2025', terms: ['love', 'dark', 'man', 'world'] },
  { label: '📺 Top Series of 2024', year: '2024', terms: ['love', 'dark', 'man', 'blood'] },
  { label: '📺 Top Series of 2023', year: '2023', terms: ['love', 'dark', 'man', 'rise'] },
  { label: '📺 Top Series of 2022', year: '2022', terms: ['love', 'dark', 'man', 'war']  },
];

const PRESET_TERMS = ['spider-man', 'avengers', 'batman', 'top gun', 'john wick', 'black panther', 'jurassic', 'fast furious'];
const DEFAULT_FILTERS = { genre: '', yearFrom: 1970, yearTo: new Date().getFullYear(), minRating: '', type: '' };

// ── Cache (bump version key whenever row structure changes) ────────────────
const CACHE_KEY = 'okpes_home_v4';
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null; }
    return data;
  } catch { return null; }
};

const writeCache = (data) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
};

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── Main fetch helper — 2 pages × 2 terms = up to 40 results per row ───────
const fetchRowResults = async (terms, year = '', type = '') => {
  const seen = new Set();
  const all = [];
  // Use first 2 terms, 2 pages each → max 40 results
  for (const term of terms.slice(0, 2)) {
    for (const page of [1, 2]) {
      try {
        const data = await fetchMovies(term, page, year, type); // type passed to OMDb directly
        if (data.Response === 'True') {
          (data.Search || []).forEach(m => {
            if (!seen.has(m.imdbID)) { seen.add(m.imdbID); all.push(m); }
          });
        }
      } catch { /* skip failed page */ }
    }
  }
  return all; // stored unshuffled; shuffle on read
};

// ──────────────────────────────────────────────────────────────────────────

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genreRows, setGenreRows] = useState({});
  const [movieYearRows, setMovieYearRows] = useState({});
  const [seriesYearRows, setSeriesYearRows] = useState({});
  const [rowsLoading, setRowsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [trendingTerm] = useState(() => PRESET_TERMS[Math.floor(Math.random() * PRESET_TERMS.length)]);

  const { watchlist } = useWatchlist();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');

  const observer = useRef();
  const lastMovieRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(p => p + 1);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Personalised "For You" genre from watchlist
  const favGenre = (() => {
    const gMap = {};
    watchlist.forEach(m => {
      if (m.Genre && m.Genre !== 'N/A') {
        m.Genre.split(', ').forEach(g => { gMap[g] = (gMap[g] || 0) + 1; });
      }
    });
    const top = Object.entries(gMap).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
  })();

  // ── Load rows (cache-first) ──────────────────────────────────────────────
  useEffect(() => {
    if (searchQuery) return;

    const loadRows = async () => {
      setRowsLoading(true);

      const cached = readCache();
      if (cached) {
        // Shuffle cached arrays so each session looks different
        const gr = {};
        Object.entries(cached.genreRows).forEach(([k, v]) => { gr[k] = shuffle(v); });
        setGenreRows(gr);

        const myr = {};
        Object.entries(cached.movieYearRows).forEach(([k, v]) => { myr[k] = shuffle(v); });
        setMovieYearRows(myr);

        const syr = {};
        Object.entries(cached.seriesYearRows).forEach(([k, v]) => { syr[k] = shuffle(v); });
        setSeriesYearRows(syr);

        setRowsLoading(false);
        return;
      }

      // ── Fresh fetch ────────────────────────────────────────────────────
      const grData = {};
      for (const row of GENRE_ROWS) {
        grData[row.label] = await fetchRowResults(row.terms, '', row.type);
      }
      setGenreRows(grData);

      const myrData = {};
      for (const row of MOVIE_YEAR_ROWS) {
        myrData[row.year] = await fetchRowResults(row.terms, row.year, 'movie');
      }
      setMovieYearRows(myrData);

      const syrData = {};
      for (const row of SERIES_YEAR_ROWS) {
        syrData[row.year] = await fetchRowResults(row.terms, row.year, 'series');
      }
      setSeriesYearRows(syrData);

      writeCache({ genreRows: grData, movieYearRows: myrData, seriesYearRows: syrData });
      setRowsLoading(false);
    };

    loadRows();
  }, []);

  // Reset on search/filter change
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, filters]);

  // Paginated search/filter
  useEffect(() => {
    if (!searchQuery && !filters.genre) return;
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const term = filters.genre || searchQuery || trendingTerm;
        const data = await fetchMovies(term, page);
        if (data.Response === 'True') {
          let results = data.Search || [];
          if (filters.yearFrom || filters.yearTo) {
            results = results.filter(m => {
              const y = parseInt(m.Year);
              return y >= (filters.yearFrom || 1970) && y <= (filters.yearTo || 9999);
            });
          }
          setMovies(prev => {
            const ids = new Set(prev.map(m => m.imdbID));
            return [...prev, ...results.filter(m => !ids.has(m.imdbID))];
          });
          if (data.Search.length < 10) setHasMore(false);
        } else {
          if (page === 1) setError(data.Error);
          else setHasMore(false);
        }
      } catch {
        if (page === 1) setError('Failed to fetch movies. Please check your API key.');
      } finally {
        setLoading(false);
      }
    };
    if (hasMore) loadMovies();
  }, [searchQuery, filters, trendingTerm, page]);

  const isSearchMode = !!searchQuery || !!filters.genre;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="container home-content">

        <div className="search-toolbar">
          {searchQuery && <h2 className="search-label">Results for "<span className="accent">{searchQuery}</span>"</h2>}
          <button className={`btn btn-glass filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(v => !v)}>
            {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        {showFilters && <FilterBar filters={filters} onChange={setFilters} />}

        {isSearchMode ? (
          <>
            <header className="home-header">
              <h1>{filters.genre ? `🎬 ${filters.genre} Movies` : 'Search Results'}</h1>
            </header>
            {error && movies.length === 0 && (
              <div className="error-state"><h2>Oops!</h2><p>{error}</p></div>
            )}
            <div className="movies-grid animate-fade-in">
              {movies.map((movie, index) =>
                index === movies.length - 1
                  ? <div ref={lastMovieRef} key={`${movie.imdbID}-${index}`}><MovieCard movie={movie} /></div>
                  : <MovieCard key={`${movie.imdbID}-${index}`} movie={movie} />
              )}
              {loading && [...Array(4)].map((_, i) => (
                <div key={`sk-${i}`} className="skeleton" style={{ height: '350px' }}></div>
              ))}
            </div>
            {!loading && !hasMore && movies.length > 0 && (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>You've reached the end!</p>
            )}
          </>
        ) : (
          <>
            {/* Personalised row */}
            {favGenre && (
              <MovieRow
                title={`🎯 For You — ${favGenre}`}
                movies={genreRows[GENRE_ROWS.find(r => r.terms.some(t => favGenre.toLowerCase().includes(t)))?.label] || []}
                loading={rowsLoading}
              />
            )}

            {/* Genre rows */}
            {GENRE_ROWS.map(row => (
              <MovieRow
                key={row.label}
                title={row.label}
                movies={genreRows[row.label] || []}
                loading={rowsLoading}
              />
            ))}

            <div className="year-divider"><span>🎬 Movies by Year</span></div>

            {MOVIE_YEAR_ROWS.map(row => (
              <MovieRow
                key={`movie-${row.year}`}
                title={row.label}
                movies={movieYearRows[row.year] || []}
                loading={rowsLoading}
              />
            ))}

            <div className="year-divider"><span>📺 Series by Year</span></div>

            {SERIES_YEAR_ROWS.map(row => (
              <MovieRow
                key={`series-${row.year}`}
                title={row.label}
                movies={seriesYearRows[row.year] || []}
                loading={rowsLoading}
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
