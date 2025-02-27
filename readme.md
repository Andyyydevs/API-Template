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
- Logging with Winston
- CORS support

## Prerequisites

- Node.js (v12 or higher)
- MongoDB

## Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/api-template.git
cd api-template
```

2. Install dependencies:
```sh
   npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```
URL= http://localhost:
PORT= 3000
TEST_API_TOKEN= INSERT_TOKEN
MONGODB_URI= INSERT_CONNECTION_STRING
JWT_SECRET= YOUR_JWT_SECRET
JWT_EXPIRES = 1h
SESSION_SECRET= YOUR_SESSION_SECRET
```

## Usage

1. Start the server:
```sh
   npm start
```

2. Access the application at `http://localhost:3000`

## API Documentation

### Authentication

- **Register**: POST `/auth/register`
 ```JSON
{
  "username": "your_username",
  "password": "your_password"
}
 ```

- **Login**: POST `/auth/login`
```JSON
{
  "username": "your_username",
  "password": "your_password"
}
```
- **Logout**: GET `/auth/logout`

### Products API

- **Get all products**: GET `/api/:apiToken/products`
  - Query parameters:
    - `filtername`: Filter products by name (case-insensitive)
    - `filtersku`: Filter products by SKU (case-insensitive)
    - `filterid`: Filter products by ID (integer)
    - `sort`: Sort products (e.g., `name:asc` or `price:desc`)
    - `limit`: Limit the number of returned products (positive integer)


## Security

This template includes several security features:

- Helmet middleware for setting various HTTP headers
- JWT for secure authentication
- API token-based access
- Rate limiting to prevent abuse


## Logging
Logging is implemented using Winston. Logs are stored in the `src/logs` directory:

- `combined.log`: Logs all requests
- `error.log`: Logs errors

## Testing

To test the API token functionality, use the `testToken.js` script:

```sh
node src/Tests/testToken.js
```

Make sure to set the `TEST_API_TOKEN` environment variable before running the test.

## Database Seeding and Updating

- The database is automatically seeded with initial products when empty.
- To update the database with new products, use the `updateDB` function.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
