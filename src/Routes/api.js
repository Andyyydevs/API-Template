const express = require('express');
const Product = require('../Models/products');
const User = require('../Models/user');
const { authenticateApiToken } = require('../middleware/auth');
const router = express.Router();

// Get all products with filtering, sorting, and limiting
router.get('/:apiToken/products', authenticateApiToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $inc: { requestCount: 1 } });

    const { search, sort, limit } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    }

    let productsQuery = Product.find(query).sort(sortOptions);

    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery;

    res.json({
      products,
      totalProducts: products.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});


module.exports = router;
