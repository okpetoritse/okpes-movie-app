import React, { createContext, useContext, useState } from 'react';

const ReviewsContext = createContext();
export const useReviews = () => useContext(ReviewsContext);

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('movieAppReviews') || '{}');
    } catch { return {}; }
  });

  const saveReview = (imdbID, { rating, text, title, poster, year }) => {
    setReviews(prev => {
      const updated = {
        ...prev,
        [imdbID]: { rating, text, title, poster, year, savedAt: new Date().toISOString() }
      };
      localStorage.setItem('movieAppReviews', JSON.stringify(updated));
      return updated;
    });
  };

  const getReview = (imdbID) => reviews[imdbID] || null;

  const allReviews = Object.entries(reviews).map(([imdbID, data]) => ({ imdbID, ...data }));

  return (
    <ReviewsContext.Provider value={{ reviews, saveReview, getReview, allReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};
