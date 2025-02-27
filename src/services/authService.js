const crypto = require('crypto');
const User = require('../Models/user')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (username, password) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const apiToken = crypto.randomBytes(32).toString('hex');
  const user = new User({ username, password, apiToken });
  await user.save();
  return user;
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = { registerUser, loginUser };