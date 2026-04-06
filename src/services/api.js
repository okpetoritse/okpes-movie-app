import axios from 'axios';

// IMPORTANT: Replace this API key if user provides one later.
// OMDb API has a 1000 request limit per day on free tier.
const API_KEY = '1a4ce9a5'; // Public test key for prototyping if needed, or ask user later. Note: This key might hit limits.
const BASE_URL = `https://www.omdbapi.com/`;

export const fetchMovies = async (searchQuery, page = 1, year = '', type = '') => {
  try {
    const yearParam = year ? `&y=${year}` : '';
    const typeParam = type ? `&type=${type}` : '';
    const response = await axios.get(`${BASE_URL}?s=${encodeURIComponent(searchQuery)}&page=${page}${yearParam}${typeParam}&apikey=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}?i=${id}&plot=full&apikey=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchTrending = async () => {
  // OMDb doesn't have a discover/trending endpoint.
  // We'll mock it by searching for popular generic terms like 'avengers', 'batman', 'matrix'
  const terms = ['avengers', 'batman', 'star wars', 'matrix', 'spider-man'];
  const randomTerm = terms[Math.floor(Math.random() * terms.length)];
  return fetchMovies(randomTerm);
};
