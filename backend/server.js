/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/watchly', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Watchly API is running' });
});

// Import routes
const movieRoutes = require('./routes/movies');
const adminRoutes = require('./routes/admin');
const searchRoutes = require('./routes/search');

// Use routes
app.use('/api/movies', movieRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

// Error handling middleware
app.use((err, req, res, _next) => {
  void _next;
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Watchly backend server running on port ${PORT}`);
});
