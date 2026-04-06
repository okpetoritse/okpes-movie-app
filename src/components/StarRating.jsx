import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ value = 0, onChange, readonly = false, size = 28 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            className={`star-btn ${filled ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star size={size} fill={filled ? 'currentColor' : 'none'} />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
