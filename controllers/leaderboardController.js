const Expense = require('../models/expense');
const User = require('../models/user');
const mongoose = require('mongoose');  // Import mongoose to use ObjectId

const getLeaderboard = async (req, res) => {
    try {
        // Find premium users and calculate total expenses
        const leaderboard = await Expense.aggregate([
            {
                $addFields: {
                    user_id: { $toObjectId: "$user_id" }  // Convert user_id from string to ObjectId
                }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'user_id', 
                    foreignField: '_id', 
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' }, 
            { $match: { 'userDetails.isPremium': true } },
            {
                $group: {
                    _id: '$user_id', 
                    name: { $first: '$userDetails.name' },
                    total_expenses: { $sum: { $toDouble: '$amount' } } 
                }
            },
            { $sort: { total_expenses: -1 } } 
        ]);

        console.log(leaderboard);
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ error: 'Database query error' });
    }
};

module.exports = { getLeaderboard };
