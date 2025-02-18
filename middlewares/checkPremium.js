const User = require('../models/user'); // Import the User model

const checkPremium = async (req, res, next) => {
    const userId = req.user.userId; // Get user ID from the decoded token

    try {
        // Find the user by ID in MongoDB
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isPremium) {
            return res.status(403).json({ message: 'Access denied. Premium membership required.' });
        }

        next(); // Allow the user to proceed if they are premium
    } catch (error) {
        console.error('Error in checkPremium middleware:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = checkPremium;
