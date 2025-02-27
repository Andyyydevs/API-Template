const express = require('express');
const { authenticateUser } = require('../Middleware/auth');
const {registerUser, loginUser} = require('../services/authService')
const router = express.Router();

// Render registration form
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    await registerUser(username, password); // Register the user
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(400).render('error', { message: 'Registration failed', error: error.message });
  }
});

//Render Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password); // Log in the user
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).render('error', { message: 'Login failed', error: error.message });
  }
});

router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const user = req.user; // User is already attached to the request by the middleware
    res.render('dashboard', { user });
  } catch (error) {
    res.redirect('/auth/login');
  }
});

router.get('/api-usage', authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.render('APITracking', { user });
  } catch (error) {
    res.redirect('/auth/login');
  }
});

// Redirect to login form after sucessfull logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

module.exports = router;
