import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Send, Trash2, Edit2, X, Check } from 'lucide-react';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Send form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState('ALL');
  const [targetId, setTargetId] = useState('');
  const [targetRole, setTargetRole] = useState('USER');
  const [sendSuccess, setSendSuccess] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications/admin/all');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, message, targetType };
      if (targetType === 'SELECTED' && targetId) {
        payload.targetUserIds = [parseInt(targetId)];
      } else if (targetType === 'ROLE') {
        payload.targetRole = targetRole;
      }
      
      await api.post('/notifications/send', payload);
      setSendSuccess(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSendSuccess(false), 3000);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to send', err);
      alert('Failed to send notification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await api.delete(`/notifications/admin/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const startEdit = (notif) => {
    setEditingId(notif.id);
    setEditTitle(notif.title);
    setEditMessage(notif.message);
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/notifications/admin/${id}`, { title: editTitle, message: editMessage });
      setNotifications(notifications.map(n => n.id === id ? res.data.data : n));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Manage Notifications</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Send size={20} /> Send New Notification
        </h2>
        
        {sendSuccess && (
          <div className="badge badge-success" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            Notification sent successfully!
          </div>
        )}
        
        <form onSubmit={handleSend} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea className="input-field" value={message} onChange={e => setMessage(e.target.value)} rows="4" required />
            </div>
          </div>
          
          <div>
            <div className="input-group">
              <label className="input-label">Target Audience</label>
              <select className="input-field" value={targetType} onChange={e => setTargetType(e.target.value)}>
                <option value="ALL">All Users</option>
                <option value="ROLE">Specific Role</option>
                <option value="SELECTED">Specific User (ID)</option>
              </select>
            </div>
            
            {targetType === 'SELECTED' && (
              <div className="input-group animate-fade-in">
                <label className="input-label">User ID</label>
                <input type="number" className="input-field" value={targetId} onChange={e => setTargetId(e.target.value)} required />
              </div>
            )}
            
            {targetType === 'ROLE' && (
              <div className="input-group animate-fade-in">
                <label className="input-label">Role</label>
                <select className="input-field" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Send Notification
            </button>
          </div>
        </form>
      </div>
      
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>All Sent Notifications</h2>
        
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>ID</th>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>User ID</th>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Title / Message</th>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(notif => (
                <tr key={notif.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>#{notif.id}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{notif.userId}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className="badge badge-primary">{notif.type}</span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', width: '50%' }}>
                    {editingId === notif.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input className="input-field" value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ padding: '0.25rem' }}/>
                        <textarea className="input-field" value={editMessage} onChange={e => setEditMessage(e.target.value)} style={{ padding: '0.25rem' }} rows="2"/>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 600 }}>{notif.title}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{notif.message}</div>
                      </>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    {editingId === notif.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => saveEdit(notif.id)} className="btn btn-primary" style={{ padding: '0.25rem' }}><Check size={16}/></button>
                        <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ padding: '0.25rem' }}><X size={16}/></button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => startEdit(notif)} className="btn btn-secondary" style={{ padding: '0.25rem' }}><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(notif.id)} className="btn btn-secondary" style={{ padding: '0.25rem', color: 'var(--accent-danger)' }}><Trash2 size={16}/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
