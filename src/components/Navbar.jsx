import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, LogOut, Bookmark, Search, List } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="brand">
          <Film className="brand-icon" />
          <span className="brand-text">MyFlix</span>
        </Link>
        <div className="nav-search">
          <form onSubmit={handleSearch} className="search-form">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </form>
        </div>
        <div className="nav-links">
          <Link to="/watchlist" className="nav-link">
            <Bookmark size={20} />
            <span className="nav-label">Watchlist</span>
          </Link>
          <Link to="/lists" className="nav-link">
            <List size={20} />
            <span className="nav-label">My Lists</span>
          </Link>
          <div className="user-menu">
            <span className="welcome-text">Hi, {user.username}</span>
            <button onClick={handleLogout} className="btn-icon" aria-label="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
