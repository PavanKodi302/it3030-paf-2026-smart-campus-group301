import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Bell, User, LogOut, ShieldAlert, GraduationCap } from 'lucide-react';
import api from '../api/axios';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-primary)', width: '40px', height: '40px', borderRadius: '12px', boxShadow: '0 4px 15px var(--accent-primary-glow)' }}>
            <GraduationCap size={24} color="#fff" />
          </div>
          <span style={{ background: 'linear-gradient(to right, #fff, #a8a2b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.25rem' }}>Smart Campus</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {/* User Links */}
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} /> Profile
          </NavLink>
          
          <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
            <Bell size={20} /> Notifications
            {unreadCount > 0 && (
              <span className="badge badge-danger" style={{ position: 'absolute', right: '1rem' }}>
                {unreadCount}
              </span>
            )}
          </NavLink>

          {/* Admin Links */}
          {isAdmin && (
            <>
              <div style={{ margin: '1rem 0 0.5rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Admin
              </div>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users size={20} /> Manage Users
              </NavLink>
              <NavLink to="/admin/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} /> Manage Notifications
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ padding: '1rem' }}>
          <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0d1117' }}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
