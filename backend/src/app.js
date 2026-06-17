const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const apiRouter = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
  'https://rahruc.vercel.app',
  'http://localhost:5173',
];
if (env.CLIENT_URL) {
  allowedOrigins.push(env.CLIENT_URL);
  allowedOrigins.push(env.CLIENT_URL.replace(/\/$/, ''));
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use('/api/v1/auth/login', generalLimiter);
app.use('/api/v1/auth/register', generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// API Routes
app.use('/api/v1', apiRouter);

// Catch-all 404
app.use((req, res, next) => {
  next(new ApiError(404, "API route not found"));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
