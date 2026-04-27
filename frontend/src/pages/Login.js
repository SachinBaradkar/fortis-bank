import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API}/login`, form);
      login(res.data.user);
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0a1628 0%, #1d3461 100%)' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', color: '#fff' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, fontWeight: 500, letterSpacing: 2, marginBottom: 8 }}>
          FORTIS<span style={{ color: '#c9a84c' }}>.</span>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', opacity: 0.8, marginBottom: 48 }}>Private Banking</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, lineHeight: 1.2, marginBottom: 20, maxWidth: 400 }}>
          Secure Banking.<br /><span style={{ color: '#c9a84c' }}>Anywhere. Anytime.</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>
          Experience the next level of personal finance management with Fortis Bank's secure digital banking platform.
        </p>
        <div style={{ display: 'flex', gap: 32, marginTop: 56 }}>
          {['256-bit Encryption', 'Zero-Fee Transfers', '24/7 Support'].map(f => (
            <div key={f} style={{ textAlign: 'center' }}>
              <div style={{ width: 8, height: 8, background: '#c9a84c', borderRadius: '50%', margin: '0 auto 8px' }} />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{f}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{ width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, color: '#fff', marginBottom: 6 }}>Welcome</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 36 }}>Enter your credentials to access your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Username</label>
            <input className="form-input" placeholder="Enter Username here" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
          </div>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Demo: <strong style={{color:'#c9a84c'}}>sachin.baradkar</strong> / <strong style={{color:'#c9a84c'}}>password123</strong></p>

          <button className="btn-gold" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In to Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            🔒 Secured with 256-bit SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
}