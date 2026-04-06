import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

/* ── Simple SVG icons so there's zero extra dependency ── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.805 10.023H21V10H12v4h5.651C16.879 16.238 14.613 18 12 18c-3.314 0-6-2.686-6-6s2.686-6 6-6c1.478 0 2.826.548 3.851 1.443l2.829-2.829C17.007 3.247 14.613 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10c5.523 0 10-4.477 10-10 0-.67-.069-1.325-.195-1.977z" fill="#EA4335"/>
    <path d="M3.153 7.345l3.286 2.41C7.327 7.607 9.52 6 12 6c1.478 0 2.826.548 3.851 1.443l2.829-2.829C17.007 3.247 14.613 2 12 2 8.076 2 4.655 4.169 3.153 7.345z" fill="#FBBC05"/>
    <path d="M12 22c2.557 0 4.904-.975 6.67-2.563l-3.079-2.607C14.613 17.78 13.376 18.25 12 18.25c-2.603 0-4.862-1.75-5.646-4.139l-3.252 2.504C4.713 19.878 8.093 22 12 22z" fill="#34A853"/>
    <path d="M21.805 10.023H21V10H12v4h5.651c-.38 1.05-1.07 1.95-1.965 2.585l3.079 2.607C20.05 17.675 22 15.088 22 12c0-.67-.069-1.325-.195-1.977z" fill="#4285F4"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      const success = login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password.');
      }
    } else {
      setError('Please fill in both fields.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>

        {/* Social Buttons */}
        <div className="auth-socials">
          <button type="button" className="social-btn" aria-label="Sign in with Google">
            <GoogleIcon />
          </button>
          <button type="button" className="social-btn" aria-label="Sign in with Facebook">
            <FacebookIcon />
          </button>
          <button type="button" className="social-btn" aria-label="Sign in with GitHub">
            <GithubIcon />
          </button>
          <button type="button" className="social-btn" aria-label="Sign in with LinkedIn">
            <LinkedInIcon />
          </button>
        </div>

        <p className="auth-divider-text">or use your email password</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            id="login-email"
            type="email"
            className="auth-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            required
          />
          <input
            id="login-password"
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            required
          />

          <p className="auth-forgot">Forget Your Password?</p>

          <button type="submit" id="login-submit" className="auth-submit-btn">
            SIGN IN
          </button>
        </form>

        <Link to="/register" className="auth-signup-link">
          CREATE AN ACCOUNT? SIGN UP
        </Link>
      </div>
    </div>
  );
};

export default Login;
