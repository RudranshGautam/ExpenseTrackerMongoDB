const Expense = require('../models/expense');

exports.getReport = async (req, res) => {
    const userId = req.user.userId;
    const { period, startDate, endDate, month, year } = req.query;
    let filter = { user_id: userId };

    try {
        if (period === 'daily' && startDate && endDate) {
            filter.created_at = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        } else if (period === 'monthly' && month && year) {
            const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
            const firstDay = new Date(year, monthIndex, 1);
            const lastDay = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
            filter.created_at = { $gte: firstDay, $lte: lastDay };
        } else {
            return res.status(400).json({ success: false, message: 'Invalid parameters' });
        }

        const expenses = await Expense.find(filter).lean();
        res.json({ success: true, expenses });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
