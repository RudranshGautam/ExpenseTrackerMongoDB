const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./database/db'); // Import MongoDB connection function
const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json

// Routes
app.use(authRoutes);
app.use(passwordRoutes);
app.use(expenseRoutes);
app.use(reportRoutes);
app.use(leaderboardRoutes);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route Handlers
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/forgot-password', (req, res) => res.sendFile(path.join(__dirname, 'public', 'forgot-password.html')));
app.get('/reset-password', (req, res) => res.sendFile(path.join(__dirname, 'public', 'reset-password.html')));
app.get('/expense', (req, res) => res.sendFile(path.join(__dirname, 'public', 'expense.html')));
app.get('/reports', (req, res) => res.sendFile(path.join(__dirname, 'public', 'reports.html')));
app.get('/leader', (req, res) => res.sendFile(path.join(__dirname, 'public', 'leader.html')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
