require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../Models/products');
const fs = require('fs').promises;
const path = require('path');

async function updateDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const dataPath = path.join(__dirname, '../Data/Products.json');
    
    try {
      const data = await fs.readFile(dataPath, 'utf8');
      const products = JSON.parse(data);

      for (const product of products) {
        await Product.findOneAndUpdate(
          { name: product.name },
          product,
          { upsert: true, new: true }
        );
      }

      console.log(`Database updated with ${products.length} products`);
    } catch (readError) {
      if (readError.code === 'ENOENT') {
        console.log('No new data to update. Skipping database update.');
      } else {
        throw readError;
      }
    }
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateDatabase();
