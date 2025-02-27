const Product = require('../Models/products');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

async function seedDB() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const data = await fs.readFile(path.join(__dirname, '../Data/Products.json'), 'utf8');
      const products = JSON.parse(data);
      await Product.insertMany(products);
      logger.info('Database seeded with initial products');
    }
    logger.info('Database already seeded');
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};

async function updateDB(productData) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to database');
    const updatedProduct = await Product.findOneAndUpdate(
      { id: parseInt(productData.id) },
      productData,
      { new: true }
    );

    if (updatedProduct) {
      logger.info('Database updated successfully!');
    } else {
      logger.error('Product not found in database');
    }
  } catch (error) {
    logger.error('Database update failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from database');
  }
}

async function clearDB() {
  try {
    const result = await Product.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents from the collection.`);
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

async function saveProductToDB(product) {
  if (!product) return;

  try {
    await Product.findOneAndUpdate(
      { id: product.id },  // Find by product ID
      { $set: product },   // Update existing or insert new
      { upsert: true, new: true }
    );
    console.log(`Saved/Updated: ${product.name}`);
  } catch (error) {
    console.error(`Error saving product ${product.id}:`, error);
  }
}

module.exports = { seedDB, updateDB, clearDB, saveProductToDB };

