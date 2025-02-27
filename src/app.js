require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/database');
const authRoutes = require('./Routes/auth');
const apiRoutes = require('./Routes/api');
const { requestLogger, errorLogger } = require('./middleware/logging');
const cors = require('cors');
const logger = require('./utils/logger');

const app = express();

// Connect to MongoDB
connectDB();

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "'unsafe-inline'"],
//             styleSrc: ["'self'", "'unsafe-inline'"],
//             connectSrc: ["'self'", "http://127.0.0.1:3030"],
//             imgSrc: ["'self'", "data:"],  // Allow images
//             fontSrc: ["'self'", "data:"]
//         }
//     }
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Add logging middleware
app.use(requestLogger);
app.use(errorLogger);

// Add CORS middleware before your routes
app.use(cors({
    origin: ['http://127.0.0.1:3030', 'http://localhost:3030'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400
}));

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${process.env.URL + PORT}`));
