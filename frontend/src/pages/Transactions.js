import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get(`${API}/transactions`).then(r => setTransactions(r.data.transactions));
  }, []);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const fmt = (n) => '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Transactions</h1>
          <p>Your complete transaction history</p>
        </div>
        <div className="page-body">

          {/* Summary */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            <div className="stat-card">
              <div className="stat-label">Total Credits</div>
              <div className="stat-value green">
                {fmt(transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0))}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Debits</div>
              <div className="stat-value red">
                {fmt(transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0))}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Transactions</div>
              <div className="stat-value">{transactions.length}</div>
            </div>
          </div>

          <div className="card">
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {['all', 'credit', 'debit'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
                    background: filter === f ? '#0a1628' : '#f0ede6',
                    color: filter === f ? '#fff' : '#9a9589',
                  }}>
                  {f === 'all' ? 'All' : f === 'credit' ? '⬆ Credits' : '⬇ Debits'}
                </button>
              ))}
            </div>

            {filtered.map(tx => (
              <div key={tx.id} className="tx-item">
                <div className={`tx-icon ${tx.type}`} style={{ fontSize: 20 }}>
                  {tx.category === 'Shopping' ? '🛒' : tx.category === 'Income' ? '💰' :
                   tx.category === 'Utilities' ? '⚡' : tx.category === 'Food' ? '🍕' :
                   tx.category === 'Entertainment' ? '🎬' : tx.category === 'Housing' ? '🏠' : '📈'}
                </div>
                <div className="tx-info">
                  <div className="tx-desc">{tx.description}</div>
                  <div className="tx-date">{tx.date} <span className="tx-category">{tx.category}</span></div>
                </div>
                <div>
                  <div className={`tx-amount ${tx.type}`}>
                    {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                  </div>
                  <div style={{ fontSize: 11, color: '#9a9589', textAlign: 'right', marginTop: 2 }}>
                    {tx.type === 'credit' ? 'Received' : 'Paid'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
