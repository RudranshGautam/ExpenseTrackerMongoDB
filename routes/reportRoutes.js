const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticateToken = require('../middlewares/authenticateToken');
const checkPremium = require('../middlewares/checkPremium');

router.get('/report', authenticateToken, checkPremium, reportController.getReport);

module.exports = router;
