const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS - allow all origins
app.use(cors());

// Parse JSON
app.use(express.json());

// API Routes - MUST COME BEFORE STATIC FILES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));

// API test route
app.get('/api', (req, res) => {
    res.json({ message: 'Medicine Reminder API is working!' });
});

// Serve static files from frontend - AFTER API routes
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve frontend for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});