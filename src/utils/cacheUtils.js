const productCache = {
    data: [],
    timestamp: 0,
    ttl: 1000 * 60 * 10, // 10 minutes TTL (time-to-live)
  };
  
  const fetchAllProducts = async () => {
    const now = Date.now();
    if (productCache.data.length > 0 && now - productCache.timestamp < productCache.ttl) {
      return productCache.data; // Return cached data if it's still valid
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:3030/api/${process.env.TEST_API_TOKEN}/products`);
      const data = await response.json();
      productCache.data = data.products || []; // Update cache
      productCache.timestamp = now;
      return productCache.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Return an empty array in case of an error
    }
  };
  
  module.exports = { fetchAllProducts };