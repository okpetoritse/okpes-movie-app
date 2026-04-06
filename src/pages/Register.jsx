import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
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

    const success = register(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('An account with this email already exists.');
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

          <button type="submit" id="register-submit" className="auth-submit-btn">
            CREATE ACCOUNT
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
