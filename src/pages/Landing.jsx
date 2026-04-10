import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    // Navigate to register and pass the email address in the state
    navigate('/register', { state: { email } });
  };

  return (
    <div className="landing-page">
      {/* Background Collage Layer */}
      <div className="landing-bg">
        <img 
          src="https://assets.nflxext.com/ffe/siteui/vlv3/dd4dfce3-1a39-4b1a-8e19-b7242da17e68/86742114-c001-4800-a127-c9c89ca7bbe4/NG-en-20240515-popsignuptwoweeks-perspective_alpha_website_large.jpg" 
          alt="Movies backdrop" 
        />
        <div className="landing-bg-overlay"></div>
      </div>

      {/* Transparent Landing Navbar */}
      <nav className="landing-navbar">
        <Link to="/" className="landing-brand">
          MyFlix
        </Link>
        <Link to="/login" className="landing-signin-btn">
          Sign In
        </Link>
      </nav>

      {/* Main Content */}
      <main className="landing-content">
        <h1 className="landing-title">Unlimited movies, TV shows, and more</h1>
        <p className="landing-subtitle">Watch anywhere. Cancel anytime.</p>
        
        <p className="landing-prompt">Ready to watch? Enter your email to create or restart your membership.</p>
        
        <form onSubmit={handleGetStarted} className="landing-form">
          <div className="landing-input-group">
            <input 
              type="email" 
              className="landing-input" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="landing-btn">
            Get Started <ChevronRight size={24} strokeWidth={3} />
          </button>
        </form>
      </main>
    </div>
  );
};

export default Landing;
