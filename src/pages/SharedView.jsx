import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Film, Loader } from 'lucide-react';
import './CustomLists.css'; // Recycled styles for simplicity

const SharedView = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedList = async () => {
      try {
        const docRef = doc(db, "shared_lists", shareId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListData(docSnap.data());
        } else {
          setError("This list doesn't exist or has been removed.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load the shared list. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchSharedList();
    }
  }, [shareId]);

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
      {/* Simple Public Navbar */}
      <nav className="navbar glass" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="nav-container" style={{ padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <Film color="#E50914" /> MyFlix
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            Build Your Own List
          </Link>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <Loader className="spinner" size={40} color="#E50914" />
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h2>Oops!</h2>
            <p style={{ color: '#a0aab2', margin: '1rem 0 2rem' }}>{error}</p>
            <Link to="/" className="btn btn-primary">Go to MyFlix Home</Link>
          </div>
        )}

        {listData && !loading && !error && (
          <div className="shared-list-content">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 800 }}>{listData.name}</h1>
              <p style={{ color: '#a0aab2' }}>Shared via MyFlix • {listData.movies.length} movies</p>
            </div>

            <div className="movies-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
              {listData.movies.map((movie) => (
                <div key={movie.imdbID} className="movie-card glass-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate(`/movie/${movie.imdbID}`)}>
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.Title}
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{movie.Title}</h3>
                    <div style={{ color: '#a0aab2', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{movie.Year}</span>
                      <span style={{ color: '#E50914', fontWeight: 'bold' }}>{movie.Type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Giant Conversion CTA */}
            <div className="cta-banner glass-card" style={{ marginTop: '5rem', padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(229,9,20,0.1), rgba(0,0,0,0.8))', border: '1px solid rgba(229,9,20,0.3)' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Track your own movies.</h2>
              <p style={{ color: '#a0aab2', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Join MyFlix for free today to build custom watchlists, rate your favorite films, and share your cinematic journey.
              </p>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SharedView;
