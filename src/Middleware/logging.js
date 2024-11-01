const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('API Request', {
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      duration: `${duration}ms`,
      status: res.statusCode,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });

  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error('API Error', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack,
    userAgent: req.get('user-agent'),
    ip: req.ip
  });

  next(err);
};

module.exports = { requestLogger, errorLogger };