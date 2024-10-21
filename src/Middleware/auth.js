const jwt = require('jsonwebtoken');
const User = require('../Models/user');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

exports.authenticateApiToken = async (req, res, next) => {
  const apiToken = req.params.apiToken;

  if (!apiToken) {
    return res.status(401).json({ message: 'No API token provided' });
  }

  try {
    const user = await User.findOne({ apiToken });
    if (!user) {
      return res.status(401).json({ message: 'Invalid API token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid API token' });
  }
};

