const express = require('express');
const passwordController = require('../controllers/passwordController');
const router = express.Router();

// Forgot Password Route
router.post('/forgot-password', passwordController.forgotPassword);

// Reset Password Route
router.post('/reset-password', passwordController.resetPassword);

module.exports = router;
