# 🎬 MyFlix - Full Stack React Application
**Developer:** Etchie Okpetoritse
**Live URL:** [https://okpes-movie-app.vercel.app/](https://okpes-movie-app.vercel.app/)

---

## 📌 Project Overview
MyFlix is a modern, responsive Single Page Application (SPA) designed for movie and TV series discovery. It integrates with real-world external APIs, handles complex user state (authentication, custom lists, watchlists), and is heavily optimized for both speed and mobile devices.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 18
- **Build Tool / Bundler:** Vite 8 (with Rolldown for optimized code-splitting)
- **Routing:** React Router v6 (Client-side routing)
- **Styling:** Vanilla CSS3 (Custom Glassmorphism UI, CSS Grid, Flexbox)
- **External Data:** OMDb API (Open Movie Database)
- **HTTP Client:** Axios (Promise-based data fetching)
- **Icons:** Lucide React
- **Deployment:** Vercel (Continuous Integration / Continuous Deployment from GitHub)

---

## 🚀 Key Technical Features (For Presentation)

### 1. Smart API Caching Layer (Performance Optimization)
**The Problem:** The OMDb API strictly limits usage to 1,000 requests per day. Without caching, a single page reload fetching multiple categories (Action, Drama, 2024 hits, etc.) would cost ~22 requests, quickly exhausting the limit.
**The Solution:** 
- Engineered a **Time-To-Live (TTL)** cache using the browser's `localStorage`.
- Data is fetched once and stored securely for **4 hours**. 
- Whenever the user refreshes within that 4-hour window, the app intercepts the API call and instantly loads the movies directly from the browser memory, costing **0 API limits** and loading in milliseconds.

### 2. Client-Side Authentication (State Management)
- Users can register and log in securely.
- User data (email, password hashes, and user sessions) are managed globally across all pages using **React Context API** (`AuthContext`).
- Auto-extracts a friendly display username from the user's registered email prefix.

### 3. Persistent User Personalization
- **Watchlist & Custom Lists:** Users can create custom collections of movies. 
- Using React's Context API combined with `localStorage`, custom lists, ratings, and written reviews are persisted across browser sessions so data is never lost when closing the tab.
- **"For You" Algorithm:** The home page dynamically calculates the user's most saved movie genre from their Watchlist and injects a personalized "🎯 For You" row.

### 4. Advanced Frontend Architecture & Layout
- **Mobile-First Responsive Design:** Adapts fluidly from a 1-column layout on small phones to a 5-column CSS Grid on 1200px+ desktops.
- **Glassmorphism UI:** Implemented modern, frosted-glass effects using `backdrop-filter: blur()`, giving the app a premium, sleek aesthetic similar to native iOS/macOS apps.
- **Image Error Boundaries:** If an API returns a broken image link, the React component automatically intercepts the `onError` synthetic event and injects a custom, high-quality fallback placeholder.

### 5. Infinite Scroll & Pagination 
- Bypassed the OMDb API limitation of returning only 10 movies per request by implementing multi-page fetching logic.
- Search results utilize the **Intersection Observer API** to detect when the user scrolls to the bottom of the page, automatically fetching and appending the next page of results (Infinite Scrolling).

### 6. Lighthouse SEO & Performance Tuning
- Achieved high web vitals by implementing `<link rel="preconnect">` for external font and API origins to reduce connection setup time (TTFB).
- **Code Splitting:** Configured Vite's Rolldown bundler to split heavy libraries (`react`, `axios`, `lucide-react`) into separate JS chunks. This allows the browser to cache third-party libraries permanently, drastically speeding up application load times.
- Semantic HTML and full OpenGraph (`og:title` / `og:description`) meta tags injected for strong Search Engine Optimization.

---

## 👨‍🏫 What to tell your teachers:
> *"I built MyFlix to demonstrate my ability to handle full web application lifecycles. I didn't just build a UI; I focused on solving real-world engineering problems—like engineering a 4-hour client-side cache to bypass strict API rate limits, implementing infinite scrolling through Intersection Observers, and utilizing Vite's code-splitting to optimize the JavaScript payloads for maximum Lighthouse performance scores."*
