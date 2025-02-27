const mongoose = require('mongoose');
const {seedDB} = require('../utils/mongoose');
const logger = require('../utils/logger');
const connectDB = async () => {
  try {
    logger.info('Connecting to Database...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connection Successfull');
    
    // Seed the database if it's empty
    await seedDB();
    
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
