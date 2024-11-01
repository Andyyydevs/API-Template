const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

async function rotateLogs() {
  const logsDir = path.join(__dirname, '../logs');
  const date = new Date().toISOString().split('T')[0];

  try {
    const files = await fs.readdir(logsDir);
    
    for (const file of files) {
      if (file.endsWith('.log')) {
        const filePath = path.join(logsDir, file);
        const newPath = path.join(logsDir, `${file}.${date}`);
        
        await fs.rename(filePath, newPath);
        logger.info(`Rotated log file: ${file} to ${file}.${date}`);
      }
    }
  } catch (error) {
    logger.error('Error rotating logs:', error);
  }
}

module.exports = rotateLogs;