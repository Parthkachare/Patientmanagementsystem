const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();

// Middleware to verify JWT and extract user info
function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization']; // Try cookie or header
  if (!token) return res.redirect('/');

  jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
    if (err) return res.redirect('/');
    req.user = user;
    next();
  });
}

// ✅ Serve admin dashboard page (protected)
router.get('/', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
});

// ✅ Dashboard data (for admin dashboard frontend)
router.get('/data', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    res.json({
      totalUsers: 120,
      activeSessions: 18,
      reportsToday: 5,
      recentPatients: [
        { patientId: 'P001', name: 'Alice Smith', age: 28, condition: 'Flu', prescriptions: ['Tamiflu'] },
        { patientId: 'P002', name: 'Bob Jones', age: 45, condition: 'Diabetes', prescriptions: ['Insulin'] }
      ],
      conditionStats: [
        { condition: 'Flu', count: 25 },
        { condition: 'Diabetes', count: 12 }
      ]
    });
  });
});


module.exports = router;
