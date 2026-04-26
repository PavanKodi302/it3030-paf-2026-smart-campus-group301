import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus, GraduationCap, ArrowRight } from 'lucide-react';

// Google SVG Logo Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/oauth2/authorization/google';
  };

  return (
    <div className="auth-layout">
      {/* Left side Hero - Hidden on mobile */}
      <div className="auth-hero">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)', marginBottom: '2rem' }}>
            <GraduationCap size={28} color="var(--accent-primary)" />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '1px' }}>Smart Campus Hub</span>
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Your Academic<br/>Life, <span style={{ color: 'var(--accent-primary)' }}>Simplified.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '500px', lineHeight: 1.6 }}>
            Connect, collaborate, and manage your university experience in one beautifully designed workspace.
          </p>
        </div>
      </div>

      {/* Right side Form */}
      <div className="auth-form-container">
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', position: 'relative', zIndex: 10 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue to your dashboard</p>
          </div>
          
          {error && (
            <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button onClick={handleGoogleLogin} className="btn" style={{ width: '100%', backgroundColor: '#ffffff', color: '#3c4043', border: '1px solid #dadce0', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '0.875rem' }}>
            <GoogleIcon /> <span style={{ fontWeight: 500 }}>Continue with Google</span>
          </button>

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Or login with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="student@university.edu"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
              Sign In <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>New to Smart Campus? </span>
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, transition: 'text-shadow 0.2s' }} onMouseOver={e => e.target.style.textShadow = '0 0 10px rgba(139, 92, 246, 0.5)'} onMouseOut={e => e.target.style.textShadow = 'none'}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
