const mongoose = require('mongoose');

// Define the schema for expenses
const expenseSchema = new mongoose.Schema({
    user_id: {
            type: String, // Change from ObjectId to a simple integer
           required: true,
         },
      
  amount: {
    type: Number, // For decimal values
    required: true,
  },
  description: {
    type: String,
    maxlength: 255, // Matches varchar(255)
  },
  category: {
    type: String,
    maxlength: 100, // Matches varchar(100)
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set the current timestamp
  },
});



// Create the model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
