/**
 * Express Application Setup
 * Main entry point for the backend server
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// --- ROTA İTHALATLARI (YENİ EKLENENLER) ---
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const profileRoutes = require('./modules/sitter-profiles/profile.routes');
const messagingRoutes = require('./modules/messaging/message.routes');
const listingRoutes = require('./modules/listings/listing.routes');
const bookingRoutes = require('./modules/bookings/booking.routes');

const { notFound, errorHandler } = require('./shared/middlewares/errorHandler');

const app = express();

app.use(helmet());

// Vite varsayılan olarak 5173 portunu kullanır, buraya ekledik kral
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// --- API ROTALARININ BAĞLANMASI ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sitter-profiles', profileRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

// Hata yönetim middleware'leri en altta kalmalı
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Pet Sitter Platform API is running on port ${PORT}`);
  });
}

module.exports = app;