const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authenticateToken = require('../middlewares/authenticateToken'); // Middleware for token authentication
const paymentController = require('../controllers/paymentController');
// Add a new expense
router.post('/expense', authenticateToken, expenseController.addExpense);

// Fetch all expenses with pagination
router.get('/expenses', authenticateToken, expenseController.getExpenses);

// Update an expense
router.put('/expense/:id', authenticateToken, expenseController.updateExpense);

// Delete an expense
router.delete('/expense/:id', authenticateToken, expenseController.deleteExpense);
router.post('/create-order', authenticateToken, paymentController.createOrder);
router.post('/verify-payment', authenticateToken, paymentController.verifyPayment);
module.exports = router;
