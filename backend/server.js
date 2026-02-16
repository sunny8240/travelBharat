require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const stateRoutes = require('./routes/states');
const destinationRoutes = require('./routes/destinations');
const uploadRoutes = require('./routes/uploads');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://tb-frontend-nine.vercel.app',
  'https://travelbharat-web.vercel.app'
];

// Optional
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  maxAge: 86400,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  authSource: 'admin'
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TravelBharat Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'OK' : 'DB_DISCONNECTED',
    database: dbConnected,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/uploads', uploadRoutes);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Serve favicon.ico by redirecting to frontend public favicon if available
app.get('/favicon.ico', (req, res) => {
  try {
    const faviconPath = path.join(__dirname, '..', 'frontend', 'public', 'favicon.png');
    if (fs.existsSync(faviconPath)) {
      return res.sendFile(faviconPath);
    }
  } catch (e) {
    // ignore
  }
  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Backend running on port ${PORT}`);
  }
});

process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => process.exit(0));
  });
});

process.on('uncaughtException', () => {
  process.exit(1);
});

module.exports = app;
