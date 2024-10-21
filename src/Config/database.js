const mongoose = require('mongoose');
const seedProducts = require('../utils/seedDatabase');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Seed the database if it's empty
    await seedProducts();
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
