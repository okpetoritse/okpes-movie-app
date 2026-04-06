import React, { createContext, useContext, useState } from 'react';

const CustomListsContext = createContext();
export const useCustomLists = () => useContext(CustomListsContext);

const DEFAULT_LISTS = [
  { id: 'best-action', name: '💥 Best Action Movies', movies: [] },
  { id: 'date-night', name: '🌹 Date Night Movies', movies: [] },
  { id: 'anime-picks', name: '🌸 Anime Picks', movies: [] },
];

export const CustomListsProvider = ({ children }) => {
  const [lists, setLists] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('movieAppCustomLists') || 'null') || DEFAULT_LISTS;
    } catch { return DEFAULT_LISTS; }
  });

  const persist = (updated) => {
    setLists(updated);
    localStorage.setItem('movieAppCustomLists', JSON.stringify(updated));
  };

  const createList = (name) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    persist([...lists, { id, name, movies: [] }]);
  };

  const deleteList = (id) => persist(lists.filter(l => l.id !== id));

  const addMovieToList = (listId, movie) => {
    persist(lists.map(l => {
      if (l.id !== listId) return l;
      if (l.movies.find(m => m.imdbID === movie.imdbID)) return l;
      return { ...l, movies: [...l.movies, movie] };
    }));
  };

  const removeMovieFromList = (listId, imdbID) => {
    persist(lists.map(l => l.id !== listId ? l : { ...l, movies: l.movies.filter(m => m.imdbID !== imdbID) }));
  };

  const isInList = (listId, imdbID) => {
    const list = lists.find(l => l.id === listId);
    return list ? list.movies.some(m => m.imdbID === imdbID) : false;
  };

  return (
    <CustomListsContext.Provider value={{ lists, createList, deleteList, addMovieToList, removeMovieFromList, isInList }}>
      {children}
    </CustomListsContext.Provider>
  );
};
