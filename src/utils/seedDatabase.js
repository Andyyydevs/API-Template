const Product = require('../Models/products');
const fs = require('fs').promises;
const path = require('path');

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const data = await fs.readFile(path.join(__dirname, '../Data/Products.json'), 'utf8');
      const products = JSON.parse(data);
      await Product.insertMany(products);
      console.log('Database seeded with initial products');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedProducts;

