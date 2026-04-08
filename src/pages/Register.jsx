import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.805 10.023H21V10H12v4h5.651C16.879 16.238 14.613 18 12 18c-3.314 0-6-2.686-6-6s2.686-6 6-6c1.478 0 2.826.548 3.851 1.443l2.829-2.829C17.007 3.247 14.613 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10c5.523 0 10-4.477 10-10 0-.67-.069-1.325-.195-1.977z" fill="#EA4335"/>
    <path d="M3.153 7.345l3.286 2.41C7.327 7.607 9.52 6 12 6c1.478 0 2.826.548 3.851 1.443l2.829-2.829C17.007 3.247 14.613 2 12 2 8.076 2 4.655 4.169 3.153 7.345z" fill="#FBBC05"/>
    <path d="M12 22c2.557 0 4.904-.975 6.67-2.563l-3.079-2.607C14.613 17.78 13.376 18.25 12 18.25c-2.603 0-4.862-1.75-5.646-4.139l-3.252 2.504C4.713 19.878 8.093 22 12 22z" fill="#34A853"/>
    <path d="M21.805 10.023H21V10H12v4h5.651c-.38 1.05-1.07 1.95-1.965 2.585l3.079 2.607C20.05 17.675 22 15.088 22 12c0-.67-.069-1.325-.195-1.977z" fill="#4285F4"/>
  </svg>
);

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters long.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google sign-in failed or was cancelled.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join MyFlix and start tracking your movies</p>

        {/* Social Buttons */}
        <div className="auth-socials" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
          <button type="button" className="social-btn" aria-label="Sign up with Google" onClick={handleGoogleLogin} disabled={loading} style={{ padding: '0.8rem 2rem', width: '100%', borderRadius: 'var(--radius-md)' }}>
            <GoogleIcon /> <span style={{ marginLeft: '10px', fontWeight: '500' }}>Sign up with Google</span>
          </button>
        </div>

        <p className="auth-divider-text">or use your email</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <input
            id="register-email"
            type="email"
            className="auth-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            required
          />
          <input
            id="register-password"
            type="password"
            className="auth-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            required
            minLength="4"
          />
          <input
            id="register-confirm-password"
            type="password"
            className="auth-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            required
          />

          {/* spacing placeholder to keep button position consistent with login */}
          <p className="auth-forgot" style={{ visibility: 'hidden', margin: '0.1rem 0 1rem' }}>
            spacer
          </p>

          <button type="submit" id="register-submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <Link to="/login" className="auth-signup-link">
          ALREADY HAVE AN ACCOUNT? SIGN IN
        </Link>
      </div>
    </div>
  );
};

export default Register;
