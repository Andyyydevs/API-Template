# API Template

This is a robust API template built with Node.js, Express, and MongoDB. It provides user authentication, product management, and rate-limited API access.

## Features

- User registration and login
- JWT-based authentication
- API token generation for users
- Rate-limited API access
- Product management with filtering, sorting, and limiting
- MongoDB integration
- EJS templating for server-side rendering
- Security features including Helmet middleware

## Prerequisites

- Node.js (v12 or higher)
- MongoDB

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/api-template.git
   cd api-template
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES=1h
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Access the application at `http://localhost:3000`

## API Documentation

### Authentication

- **Register**: POST `/auth/register`
- **Login**: POST `/auth/login`
- **Logout**: GET `/auth/logout`

### Products API

- **Get all products**: GET `/api/:apiToken/products`
  - Query parameters:
    - `search`: Search products by name
    - `sort`: Sort products (e.g., `name:asc` or `price:desc`)
    - `limit`: Limit the number of returned products

## File Structure
```
src/
├── Config/
│ ├── database.js
│ └── jwt.js
├── Data/
│ └── Products.json
├── Middleware/
│ └── auth.js
├── Models/
│ ├── products.js
│ └── user.js
├── Routes/
│ ├── api.js
│ └── auth.js
├── Tests/
│ └── testToken.js
├── Utils/
│ └── seedDatabase.js
├── Views/
│ ├── Dashboard.ejs
│ ├── Login.ejs
│ ├── error.ejs
│ └── register.ejs
├── app.js
└── scripts/
└── updateDatabase.js
```

## Security

This template includes several security features:

- Helmet middleware for setting various HTTP headers
- JWT for secure authentication
- API token-based access
- Rate limiting to prevent abuse

## Testing

To test the API token functionality, use the `testToken.js` script:
```
node src/Tests/testToken.js
```

Make sure to set the `TEST_API_TOKEN` environment variable before running the test.

## Database Seeding and Updating

- The database is automatically seeded with initial products when empty.
- To update the database with new products, run:
  ```
  node src/scripts/updateDatabase.js
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
