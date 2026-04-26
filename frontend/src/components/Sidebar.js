import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: '⬛', label: 'Dashboard', path: '/dashboard' },
  { icon: '💳', label: 'Transactions', path: '/transactions' },
  { icon: '↗️', label: 'Transfer', path: '/transfer' },
  { icon: '👤', label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-name">FORTIS<span>.</span></div>
        <div className="logo-tag">Private Banking</div>
      </div>

      <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6 }}>Account Holder</div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{user?.name || 'John Doe'}</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button key={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>⬚</span> <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
