import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Save, Trash2, ShieldAlert } from 'lucide-react';

export default function Profile() {
  const { user, loadProfile, logout } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', {
        fullName,
        email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      await loadProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await api.delete('/users/me', { data: { password: deletePassword } });
      logout();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete account' });
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">My Profile</h1>

      {message.text && (
        <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ display: 'inline-block', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Update Information</h2>
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div style={{ margin: '1.5rem 0', height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Change Password (Optional)</h3>
            
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">New Password</label>
              <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>

        <div>
          <div className="card" style={{ borderColor: 'rgba(248, 81, 73, 0.3)' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} /> Danger Zone
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>

            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger">
                Delete Account
              </button>
            ) : (
              <form onSubmit={handleDelete} style={{ background: 'rgba(248, 81, 73, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248, 81, 73, 0.2)' }}>
                <div className="input-group">
                  <label className="input-label">Confirm Password</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Enter password to confirm"
                    value={deletePassword} 
                    onChange={(e) => setDeletePassword(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-danger">
                    <Trash2 size={18} /> Confirm Delete
                  </button>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
