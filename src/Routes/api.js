const express = require('express');
const Product = require('../Models/products');
const User = require('../Models/user');
const { authenticateApiToken } = require('../middleware/auth');
const router = express.Router();
const logger = require('../utils/logger');

// Get all products with filtering, sorting, and limiting
router.get('/:apiToken/products', authenticateApiToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $inc: { requestCount: 1 } });

    logger.info('Products request', {
      userId: req.user._id,
      filters: {
        search: req.query.search,
        sort: req.query.sort,
        limit: req.query.limit
      }
    });

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
    logger.error('Products request failed', {
      userId: req.user?._id,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});


module.exports = router;
