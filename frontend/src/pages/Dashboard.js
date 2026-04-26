import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/balance`).then(r => setBalance(r.data));
    axios.get(`${API}/transactions`).then(r => setTransactions(r.data.transactions.slice(0, 4)));
  }, []);

  const fmt = (n) => '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const quickActions = [
    { icon: '↗️', label: 'Send Money', path: '/transfer' },
    { icon: '📄', label: 'Statements', path: '/transactions' },
    { icon: '👤', label: 'My Profile', path: '/profile' },
    { icon: '🔔', label: 'Alerts', path: '/dashboard' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="page-body">

          {/* Balance Card */}
          <div className="balance-card">
            <div className="balance-label">Total Available Balance</div>
            {balance ? (
              <>
                <div className="balance-amount">
                  <span className="currency">₹</span>
                  {balance.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>{balance.accountType}</div>
                <div className="balance-acct">{balance.accountNo}</div>
              </>
            ) : <div style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</div>}
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">This Month Income</div>
              <div className="stat-value green">₹1,00,000</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">This Month Spent</div>
              <div className="stat-value red">₹30,448</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Cards</div>
              <div className="stat-value">2</div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Recent Transactions */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>Recent Transactions</h3>
                <button onClick={() => navigate('/transactions')}
                  style={{ fontSize: 13, color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  View All →
                </button>
              </div>
              {transactions.map(tx => (
                <div key={tx.id} className="tx-item">
                  <div className={`tx-icon ${tx.type}`}>{tx.type === 'credit' ? '⬆️' : '⬇️'}</div>
                  <div className="tx-info">
                    <div className="tx-desc">{tx.description}</div>
                    <div className="tx-date">{tx.date} <span className="tx-category">{tx.category}</span></div>
                  </div>
                  <div className={`tx-amount ${tx.type}`}>
                    {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <div className="card">
                <h3 className="section-title">Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {quickActions.map(q => (
                    <div key={q.label} className="qa-item" onClick={() => navigate(q.path)}
                      style={{ padding: '20px 12px' }}>
                      <div className="qa-icon">{q.icon}</div>
                      <div className="qa-label">{q.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ marginTop: 20, background: 'linear-gradient(135deg, #0a1628, #1d3461)', color: '#fff' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 }}>Fortis Gold Card</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, marginBottom: 16 }}>Premium Member</div>
                <div style={{ fontSize: 13, letterSpacing: 3, color: 'rgba(255,255,255,0.5)' }}>4821 •••• •••• 2200</div>
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  <span>VALID THRU 12/28</span><span>JOHN DOE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
