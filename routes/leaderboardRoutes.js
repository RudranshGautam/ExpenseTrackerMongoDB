const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authenticateToken = require('../middlewares/authenticateToken');
const checkPremium = require('../middlewares/checkPremium');

router.get('/leaderboard', authenticateToken, checkPremium, leaderboardController.getLeaderboard);

module.exports = router;
