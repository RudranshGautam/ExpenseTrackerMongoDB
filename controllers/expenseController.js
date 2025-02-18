const Expense = require('../models/expense');
const mongoose = require('mongoose');  // Add this line

// Add a new expense
exports.addExpense = async (req, res) => {
    const { amount, description, category } = req.body;
    const userId = req.user.userId;


    try {
        const expense = new Expense({
            user_id: userId,
            amount:Number(amount),
            description,
            category,
        });

        await expense.save();
        res.json({ success: true, message: 'Expense added successfully', expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Fetch all expenses with pagination
exports.getExpenses = async (req, res) => {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const expenses = await Expense.find({ user_id: userId })
            .sort({ created_at: -1 }) 
            .skip(skip)
            .limit(limit);

        const totalExpenses = await Expense.countDocuments({ user_id: userId });

        res.json({
            success: true,
            expenses,
            totalPages: Math.ceil(totalExpenses / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
    const { amount, description, category } = req.body;
    const userId = req.user.userId;
    const expenseId = req.params.id;
   
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, user_id: userId },
            { amount, description, category },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        }

        res.json({ success: true, message: 'Expense updated successfully', expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    const userId = req.user.userId;
    const expenseId = req.params.id;
    try {
        const expense = await Expense.findOneAndDelete({ _id: expenseId, user_id: userId });

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        }

        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
