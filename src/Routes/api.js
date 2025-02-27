const express = require('express');
const Product = require('../Models/products');
const User = require('../Models/user');
const { authenticateApiToken } = require('../Middleware/auth');
const router = express.Router();
const logger = require('../utils/logger');
const { query, validationResult } = require('express-validator');

/**
 * GET /:apiToken/products
 * Fetches products with optional filtering, sorting, and limiting.
 */
router.get(
  '/:apiToken/products',
  authenticateApiToken,
  [
    // Input validation for query parameters
    query('filtername').optional().isString().withMessage('filtername must be a string'),
    query('filtersku').optional().isString().withMessage('filtersku must be a string'),
    query('filterid').optional().isInt().withMessage('filterid must be an integer'),
    query('sort').optional().isString().withMessage('sort must be a string'),
    query('limit').optional().isInt({ min: 1 }).withMessage('limit must be a positive integer'),
  ],
  async (req, res) => {
    try {
      // Validate query parameters
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Validation failed for products request', {
          userId: req.user._id,
          errors: errors.array(),
        });
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      // Increment the user's request count
      await User.findByIdAndUpdate(req.user._id, { $inc: { requestCount: 1 } });

      // Log the request
      logger.info('Products request', {
        userId: req.user._id,
        filters: {
          filtername: req.query.filtername,
          filtersku: req.query.filtersku,
          filterid: req.query.filterid,
          sort: req.query.sort,
          limit: req.query.limit,
        },
      });

      // Build the query
      const { filtername, filtersku, filterid, sort, limit } = req.query;
      const query = {};

      if (filtername) {
        query.name = { $regex: filtername, $options: 'i' }; // Case-insensitive search
      }

      if (filterid) {
        query.id = parseInt(filterid); // Convert filterid to integer
      }

      if (filtersku) {
        query.SKU = { $regex: filtersku, $options: 'i' }; // Case-insensitive search
      }

      // Build the sort options
      const sortOptions = {};
      if (sort) {
        const [field, order] = sort.split(':');
        sortOptions[field] = order === 'desc' ? -1 : 1; // Ascending or descending
      }

      // Fetch products with filtering, sorting, and limiting
      let productsQuery = Product.find(query).sort(sortOptions);

      if (limit) {
        productsQuery = productsQuery.limit(parseInt(limit)); // Apply limit
      }

      const products = await productsQuery;

      // Return the response
      res.json({
        products,
        totalProducts: products.length,
      });
    } catch (error) {
      // Log the error
      logger.error('Products request failed', {
        userId: req.user?._id,
        error: error.message,
        stack: error.stack,
      });

      // Return an error response
      res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
  }
);

module.exports = router;