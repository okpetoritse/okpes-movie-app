import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { CustomListsProvider } from './context/CustomListsContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import CustomLists from './pages/CustomLists';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <WatchlistProvider>
          <ReviewsProvider>
            <CustomListsProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                <Route path="/lists" element={<ProtectedRoute><CustomLists /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CustomListsProvider>
          </ReviewsProvider>
        </WatchlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
