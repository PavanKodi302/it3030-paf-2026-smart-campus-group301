import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Check, CheckSquare, Trash2, MailOpen, Mail } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllAsRead} className="btn btn-secondary">
            <CheckSquare size={18} /> Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
          <MailOpen size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>You're all caught up!</h3>
          <p>No new notifications to show.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                padding: '1.5rem',
                borderLeft: notif.isRead ? 'none' : '4px solid var(--accent-primary)',
                backgroundColor: notif.isRead ? 'var(--bg-secondary)' : 'rgba(88, 166, 255, 0.05)'
              }}
            >
              <div style={{ color: notif.isRead ? 'var(--text-secondary)' : 'var(--accent-primary)', marginTop: '0.25rem' }}>
                {notif.isRead ? <MailOpen size={24} /> : <Mail size={24} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', color: notif.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{notif.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{notif.message}</p>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  {!notif.isRead && (
                    <button onClick={() => markAsRead(notif.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                      <Check size={14} /> Mark Read
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notif.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--accent-danger)' }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
