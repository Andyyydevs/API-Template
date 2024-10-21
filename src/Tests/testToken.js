const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_TOKEN = process.env.TEST_API_TOKEN;

if (!API_TOKEN) {
  console.error('Please set the TEST_API_TOKEN environment variable');
  process.exit(1);
}

async function testApiToken() {
  try {
    const response = await axios.get(`${API_URL}/api/${API_TOKEN}/products`, {
      params: {
        // Add any query parameters here
      }
    });

    console.log('API request successful!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('API request failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testApiToken();
