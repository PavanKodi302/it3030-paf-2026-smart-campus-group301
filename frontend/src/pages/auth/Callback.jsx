import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Callback() {
  const navigate = useNavigate();
  const { loadProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      loadProfile().then(() => {
        navigate('/');
      });
    } else {
      console.error('No token found in callback URL');
      navigate('/login');
    }
  }, [navigate, loadProfile, searchParams]);

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Authenticating...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please wait while we complete your login.</p>
      </div>
    </div>
  );
}
