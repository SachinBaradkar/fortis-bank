import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`${API}/profile`).then(r => setProfile(r.data.user));
  }, []);

  const fields = profile ? [
    { label: 'Full Name', value: profile.name },
    { label: 'Email Address', value: profile.email },
    { label: 'Phone Number', value: profile.phone },
    { label: 'Account Number', value: profile.accountNo },
    { label: 'Branch', value: profile.branch },
    { label: 'IFSC Code', value: profile.ifsc },
  ] : [];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Your personal and account information</p>
        </div>
        <div className="page-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
            {/* Avatar Card */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #0a1628, #1d3461)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>👤</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: '#0a1628' }}>{profile?.name || '—'}</div>
              <div style={{ fontSize: 12, color: '#9a9589', marginTop: 4 }}>Premium Account Holder</div>
              <div style={{ margin: '20px 0', padding: '12px', background: '#f8f6f2', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#9a9589', letterSpacing: 1 }}>MEMBER SINCE</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a1628', marginTop: 4 }}>January 2023</div>
              </div>
              <div style={{ display: 'inline-block', background: 'rgba(26,140,91,0.1)', color: '#1a8c5b', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 20 }}>● Active Account</div>
            </div>

            {/* Info Card */}
            <div className="card">
              <h3 className="section-title">Account Information</h3>
              <div className="profile-grid">
                {fields.map(f => (
                  <div key={f.label} className="profile-field">
                    <div className="profile-field-label">{f.label}</div>
                    <div className="profile-field-value">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="card" style={{ marginTop: 24 }}>
            <h3 className="section-title">Security Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { icon: '🔒', title: '2-Factor Auth', status: 'Enabled', color: '#1a8c5b' },
                { icon: '📱', title: 'SMS Alerts', status: 'Enabled', color: '#1a8c5b' },
                { icon: '🔑', title: 'Last Login', status: 'Just Now', color: '#c9a84c' },
              ].map(s => (
                <div key={s.title} style={{ padding: '20px', background: '#f8f6f2', borderRadius: 10 }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0a1628' }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 4 }}>{s.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
