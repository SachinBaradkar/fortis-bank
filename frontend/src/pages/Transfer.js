import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function Transfer() {
  const [form, setForm] = useState({ toAccount: '', beneficiaryName: '', amount: '', description: '', ifsc: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (!form.toAccount || !form.beneficiaryName || !form.ifsc) { setError('Please fill all beneficiary details.'); return; }
    setError(''); setStep(2);
  };

  const handleTransfer = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) { setError('Please enter a valid amount.'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/transfer`, { toAccount: form.toAccount, amount: parseFloat(form.amount), description: form.description });
      setResult(res.data); setStep(3);
    } catch (e) {
      setError(e.response?.data?.message || 'Transfer failed.');
    }
    setLoading(false);
  };

  const reset = () => { setForm({ toAccount: '', beneficiaryName: '', amount: '', description: '', ifsc: '' }); setResult(null); setStep(1); };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Transfer Money</h1>
          <p>Send money securely to any bank account</p>
        </div>
        <div className="page-body">

          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 32, maxWidth: 500 }}>
            {['Beneficiary', 'Amount', 'Confirm'].map((s, i) => (
              <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13, margin: '0 auto',
                    background: step > i ? '#0a1628' : step === i + 1 ? '#c9a84c' : '#e8e4dc',
                    color: step >= i + 1 ? '#fff' : '#9a9589',
                  }}>{i + 1}</div>
                </div>
                <div style={{ fontSize: 11, marginTop: 6, color: step === i + 1 ? '#c9a84c' : '#9a9589', fontWeight: 600 }}>{s}</div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 560 }}>
            {error && <div className="alert alert-error">{error}</div>}

            {step === 1 && (
              <div className="card">
                <h3 className="section-title">Beneficiary Details</h3>
                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input className="form-input" placeholder="Enter 16-digit account number" value={form.toAccount} onChange={e => setForm({ ...form, toAccount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Beneficiary Name</label>
                  <input className="form-input" placeholder="Enter account holder name" value={form.beneficiaryName} onChange={e => setForm({ ...form, beneficiaryName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input className="form-input" placeholder="e.g. SBIN0001234" value={form.ifsc} onChange={e => setForm({ ...form, ifsc: e.target.value })} />
                </div>
                <button className="btn-primary" onClick={handleNext}>Continue →</button>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <h3 className="section-title">Transfer Amount</h3>
                <div style={{ background: '#f8f6f2', border: '1px solid #e8e4dc', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: '#9a9589' }}>To: <strong style={{ color: '#0a1628' }}>{form.beneficiaryName}</strong></div>
                  <div style={{ fontSize: 12, color: '#9a9589' }}>Account: {form.toAccount}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input className="form-input" type="number" placeholder="Enter amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ fontSize: 24, fontWeight: 600, color: '#0a1628' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <input className="form-input" placeholder="Add a note..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', borderRadius: 10, border: '1.5px solid #e8e4dc', background: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>← Back</button>
                  <button className="btn-gold" style={{ flex: 2 }} onClick={handleTransfer} disabled={loading}>{loading ? 'Processing...' : 'Transfer Now'}</button>
                </div>
              </div>
            )}

            {step === 3 && result && (
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h2 style={{ fontSize: 28, color: '#0a1628', marginBottom: 8 }}>Transfer Successful!</h2>
                <p style={{ color: '#9a9589', marginBottom: 24 }}>{result.message}</p>
                <div style={{ background: '#f8f6f2', borderRadius: 10, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8e4dc' }}>
                    <span style={{ fontSize: 13, color: '#9a9589' }}>Reference No.</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#c9a84c' }}>{result.referenceNo}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: 13, color: '#9a9589' }}>Date & Time</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{new Date().toLocaleString()}</span>
                  </div>
                </div>
                <button className="btn-primary" onClick={reset}>Make Another Transfer</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
