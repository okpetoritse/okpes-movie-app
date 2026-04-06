import React from 'react';
import './FilterBar.css';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentary'];
const RATINGS = ['Any', '5+', '6+', '7+', '7.5+', '8+', '9+'];
const YEARS = { min: 1970, max: new Date().getFullYear() };

const FilterBar = ({ filters, onChange }) => {
  const setFilter = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-bar glass">
      {/* Genre */}
      <div className="filter-group">
        <label className="filter-label">Genre</label>
        <div className="filter-pills">
          <button
            className={`pill ${!filters.genre ? 'active' : ''}`}
            onClick={() => setFilter('genre', '')}
          >All</button>
          {GENRES.map(g => (
            <button
              key={g}
              className={`pill ${filters.genre === g ? 'active' : ''}`}
              onClick={() => setFilter('genre', filters.genre === g ? '' : g)}
            >{g}</button>
          ))}
        </div>
      </div>

      {/* Year Range */}
      <div className="filter-group">
        <label className="filter-label">Year: {filters.yearFrom || YEARS.min} — {filters.yearTo || YEARS.max}</label>
        <div className="year-range">
          <input
            type="range"
            min={YEARS.min}
            max={YEARS.max}
            value={filters.yearFrom || YEARS.min}
            onChange={e => setFilter('yearFrom', Number(e.target.value))}
            className="range-input"
          />
          <input
            type="range"
            min={YEARS.min}
            max={YEARS.max}
            value={filters.yearTo || YEARS.max}
            onChange={e => setFilter('yearTo', Number(e.target.value))}
            className="range-input"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="filter-group">
        <label className="filter-label">Min Rating</label>
        <div className="filter-pills">
          {RATINGS.map(r => (
            <button
              key={r}
              className={`pill ${(filters.minRating === r) || (!filters.minRating && r === 'Any') ? 'active' : ''}`}
              onClick={() => setFilter('minRating', r === 'Any' ? '' : r)}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="filter-group">
        <label className="filter-label">Type</label>
        <div className="filter-pills">
          {['All', 'movie', 'series'].map(t => (
            <button
              key={t}
              className={`pill ${(filters.type === t) || (!filters.type && t === 'All') ? 'active' : ''}`}
              onClick={() => setFilter('type', t === 'All' ? '' : t)}
            >{t === 'movie' ? '🎬 Movie' : t === 'series' ? '📺 Series' : 'All'}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
