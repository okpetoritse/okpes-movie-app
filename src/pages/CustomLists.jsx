import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomLists } from '../context/CustomListsContext';
import { useReviews } from '../context/ReviewsContext';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import StarRating from '../components/StarRating';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Plus, Trash2, List, Share2 } from 'lucide-react';
import './CustomLists.css';

const CustomLists = () => {
  const { lists, createList, deleteList } = useCustomLists();
  const { allReviews } = useReviews();
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [activeTab, setActiveTab] = useState('lists'); // 'lists' | 'reviews'
  const [sharingId, setSharingId] = useState(null);

  const handleShareList = async (list) => {
    if (list.movies.length === 0) {
      alert("You can't share an empty list!");
      return;
    }
    
    try {
      setSharingId(list.id);
      // Write the list to Firestore
      const docRef = await addDoc(collection(db, "shared_lists"), {
        name: list.name,
        movies: list.movies,
        createdAt: new Date().toISOString()
      });
      
      // Construct the shareable URL
      const shareUrl = `${window.location.origin}/list/${docRef.id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      // Removed intrusive alert popup per user request
    } catch (e) {
      console.error("Error creating shared list: ", e);
      alert('Failed to generate link. Check console for details.');
    } finally {
      setSharingId(null);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      createList(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="container home-content">
        <div className="cl-tabs">
          <button className={`cl-tab ${activeTab === 'lists' ? 'active' : ''}`} onClick={() => setActiveTab('lists')}>
            <List size={18} /> My Lists
          </button>
          <button className={`cl-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            ⭐ My Reviews
          </button>
        </div>

        {activeTab === 'lists' && (
          <>
            <form onSubmit={handleCreate} className="create-list-form glass">
              <input
                type="text"
                className="input-glass"
                placeholder="🎬 Create a new list..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{ paddingLeft: '1rem' }}
              />
              <button type="submit" className="btn btn-primary" disabled={!newName.trim()}>
                <Plus size={20} /> Create
              </button>
            </form>

            <div className="lists-grid">
              {lists.map(list => (
                <div key={list.id} className="list-card glass-card">
                  <div className="list-card-header">
                    <h3>{list.name}</h3>
                    <div className="list-card-actions">
                      <span className="list-count">{list.movies.length} movies</span>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleShareList(list)} 
                        title="Share list" 
                        disabled={sharingId === list.id}
                        style={{ marginRight: '0.5rem', color: '#3b82f6' }}
                      >
                        <Share2 size={16} />
                      </button>
                      <button className="btn-icon" onClick={() => deleteList(list.id)} title="Delete list">
                        <Trash2 size={16} color="var(--color-primary)" />
                      </button>
                    </div>
                  </div>
                  {list.movies.length === 0 ? (
                    <p className="list-empty-hint">No movies yet. Click "Add to Custom List" on any movie page!</p>
                  ) : (
                    <div className="list-movies-mini">
                      {list.movies.slice(0, 5).map(movie => (
                        <img
                          key={movie.imdbID}
                          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/60x90?text=?'}
                          alt={movie.Title}
                          className="list-mini-poster"
                          title={movie.Title}
                          onClick={() => navigate(`/movie/${movie.imdbID}`)}
                        />
                      ))}
                      {list.movies.length > 5 && (
                        <div className="list-mini-more">+{list.movies.length - 5}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'reviews' && (
          <div>
            {allReviews.length === 0 ? (
              <div className="empty-state animate-fade-in">
                <p style={{ fontSize: '3rem' }}>⭐</p>
                <h2>No reviews yet</h2>
                <p>Go to a movie and submit your first rating and review!</p>
              </div>
            ) : (
              <div className="reviews-list animate-fade-in">
                {allReviews.sort((a,b) => new Date(b.savedAt) - new Date(a.savedAt)).map(review => (
                  <div key={review.imdbID} className="review-item glass-card" onClick={() => navigate(`/movie/${review.imdbID}`)}>
                    <img
                      src={review.poster !== 'N/A' ? review.poster : 'https://via.placeholder.com/80x120?text=?'}
                      alt={review.title}
                      className="review-poster"
                    />
                    <div className="review-body">
                      <h3 className="review-title">{review.title} <span className="review-year">({review.year})</span></h3>
                      <StarRating value={review.rating} readonly size={20} />
                      {review.text && <p className="review-text">"{review.text}"</p>}
                      <span className="review-date">{new Date(review.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomLists;
