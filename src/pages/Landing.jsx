import React from 'react';
import { Link } from 'react-router-dom';
import { Film, UserPlus, Search, ListPlus, Star, ChevronRight } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Abstract Glowing Background */}
      <div className="landing-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Modern Transparent Navbar */}
      <nav className="landing-navbar">
        <Link to="/" className="landing-brand">
          <Film className="brand-icon" size={28} color="#E50914" />
          MyFlix
        </Link>
        <Link to="/login" className="landing-signin-btn">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="landing-hero">
        <div className="hero-content">
          <span className="hero-badge">v2.0 Now Live</span>
          <h1 className="hero-title">Your Ultimate <br/><span>Cinematic</span> Companion.</h1>
          <p className="hero-subtitle">
            Don't just watch movies—track them. Build immersive watchlists, rate your favorites, and discover endless content powered by real-time cinematic data.
          </p>
          
          <div className="hero-actions">
            <Link to="/browse" className="btn-premium">
              Explore Catalog <Search size={20} />
            </Link>
            <Link to="/register" className="btn-glass">
              Create Free Account <UserPlus size={20} />
            </Link>
          </div>
        </div>

        {/* Abstract UI Representation */}
        <div className="hero-visual">
          <div className="glass-card-mockup">
            <div className="mock-row">
              <div className="mock-avatar">
                 <Film size={24} />
              </div>
              <div className="mock-lines">
                <div className="mock-line w-80"></div>
                <div className="mock-line w-40"></div>
              </div>
            </div>
            <div className="mock-line w-100"></div>
            <div className="mock-row" style={{ marginTop: '0.5rem' }}>
              <div className="mock-avatar" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                 <Star size={24} fill="currentColor" />
              </div>
              <div className="mock-lines">
                <div className="mock-line w-80"></div>
                <div className="mock-line w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Value Proposition */}
      <section className="landing-features">
        <div className="features-header">
          <h2>Why MyFlix?</h2>
          <p>Everything you need to organize your digital theater.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Search size={28} />
            </div>
            <h3>Deep Discovery</h3>
            <p>Search through over a million titles using our real-time OMDB integration. Read detailed plots, cast info, and instantly find similar movies.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <ListPlus size={28} />
            </div>
            <h3>Curate Custom Lists</h3>
            <p>Create unlimited custom watchlists. Whether it's "Halloween Horror" or "Weekend Binges," keep your movies perfectly organized.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Star size={28} />
            </div>
            <h3>Rate & Critique</h3>
            <p>Loved a movie? Hated it? Leave nuanced star ratings and write rich reviews saved securely to your personal cloud profile.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
