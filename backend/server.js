const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Dummy Data
const users = [{ username: 'john.doe', password: 'password123', name: 'John Doe', accountNo: '4821 5593 7841 2200' }];

const transactions = [
  { id: 1, date: '2025-04-20', description: 'Amazon Purchase', amount: -2499.00, type: 'debit', category: 'Shopping' },
  { id: 2, date: '2025-04-18', description: 'Salary Credit', amount: 85000.00, type: 'credit', category: 'Income' },
  { id: 3, date: '2025-04-15', description: 'Electricity Bill', amount: -1850.00, type: 'debit', category: 'Utilities' },
  { id: 4, date: '2025-04-12', description: 'Zomato Order', amount: -450.00, type: 'debit', category: 'Food' },
  { id: 5, date: '2025-04-10', description: 'Freelance Payment', amount: 15000.00, type: 'credit', category: 'Income' },
  { id: 6, date: '2025-04-08', description: 'Netflix Subscription', amount: -649.00, type: 'debit', category: 'Entertainment' },
  { id: 7, date: '2025-04-05', description: 'Rent Transfer', amount: -25000.00, type: 'debit', category: 'Housing' },
  { id: 8, date: '2025-04-02', description: 'Dividend Received', amount: 3200.00, type: 'credit', category: 'Investment' },
];

// POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, message: 'Login successful', user: { name: user.name, accountNo: user.accountNo } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// GET /balance
app.get('/balance', (req, res) => {
  res.json({ success: true, balance: 124350.75, currency: 'INR', accountNo: '4821 5593 7841 2200', accountType: 'Savings Account' });
});

// GET /transactions
app.get('/transactions', (req, res) => {
  res.json({ success: true, transactions });
});

// POST /transfer
app.post('/transfer', (req, res) => {
  const { toAccount, amount, description } = req.body;
  if (!toAccount || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid transfer details' });
  }
  res.json({ success: true, message: `₹${amount} transferred successfully to ${toAccount}`, referenceNo: 'FBK' + Date.now() });
});

// GET /user/profile
app.get('/profile', (req, res) => {
  res.json({ success: true, user: { name: 'John Doe', email: 'john.doe@email.com', phone: '+91 98765 43210', accountNo: '4821 5593 7841 2200', branch: 'Mumbai - Andheri West', ifsc: 'FORT0001234' } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Fortis Bank API running on port ${PORT}`));
