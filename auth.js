const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to check if user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login.html');
  }
}

// ✅ API: Register user (JSON request)
router.post('/register', async (req, res) => {
  try {
    const { username, fullName, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, fullName, email, password: hashedPassword, role });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// ✅ HTML form-based signup
router.post('/signup', async (req, res) => {
  try {
    const { username, fullName, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('Username, email, and password are required.');
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).send('Username or email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, fullName, email, password: hashedPassword, role });
    await user.save();

    return res.send('User registered! <a href="/login.html">Login</a>');
  } catch (err) {
    return res.status(500).send(`Error: ${err.message}`);
  }
});

// ✅ HTML form-based login with session and JWT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials.');
    }

    // ✅ Store user session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Set token cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    });

    // ✅ Redirect to admin dashboard
    res.redirect('/admin-dashboard.html');
  } catch (err) {
    return res.status(500).send('Login failed: ' + err.message);
  }
});

// ✅ API-based login (returns JWT)
router.post('/api-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// ✅ Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out.');
    }
    res.clearCookie('token');
    res.redirect('/');
  });
});

// ✅ Manually set session (for testing)
router.post('/session', (req, res) => {
  const { user } = req.body;
  if (user) {
    req.session.user = user;
    res.status(200).send('Session saved');
  } else {
    res.status(400).send('No user in request body');
  }
});

module.exports = router;
module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.loginHandler = router.stack.find(r => r.route && r.route.path === '/login').route.stack[0].handle;
module.exports.signupHandler = router.stack.find(r => r.route && r.route.path === '/signup').route.stack[0].handle;
