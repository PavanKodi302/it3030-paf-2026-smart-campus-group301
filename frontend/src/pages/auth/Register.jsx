import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(fullName, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="auth-layout">
      {/* Left side Hero - Hidden on mobile */}
      <div className="auth-hero" style={{ backgroundImage: "linear-gradient(135deg, rgba(15, 17, 26, 0.9), rgba(30, 25, 45, 0.9)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')" }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)', marginBottom: '2rem' }}>
            <GraduationCap size={28} color="var(--accent-secondary)" />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '1px' }}>Smart Campus Hub</span>
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Start Your<br/><span style={{ color: 'var(--accent-secondary)' }}>Journey</span> Here.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '500px', lineHeight: 1.6 }}>
            Join thousands of students and faculty members in the most advanced campus management platform.
          </p>
        </div>
      </div>

      {/* Right side Form */}
      <div className="auth-form-container">
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', position: 'relative', zIndex: 10 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Enter your details to get started</p>
          </div>
          
          {error && (
            <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe"
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
            </div>
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
                placeholder="Min. 8 characters"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
              Create Account <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
