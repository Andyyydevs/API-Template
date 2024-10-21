const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../Models/user');

const router = express.Router();

// Render registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('error', { message: 'Username already exists', error: null });
    }
    const apiToken = crypto.randomBytes(32).toString('hex');
    const user = new User({ username, password, apiToken });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).render('error', { message: 'Registration failed', error: error.message });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render('error', { message: 'Invalid credentials', error: null });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.redirect('/auth/dashboard');
  } catch (error) {
    res.status(400).render('error', { message: 'Login failed', error: error.message });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/auth/login');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render('dashboard', { user });
  } catch (error) {
    res.redirect('/auth/login');
  }
});

router.get('/api-docs', (req, res) => {
  res.render('api-docs');
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

module.exports = router;
