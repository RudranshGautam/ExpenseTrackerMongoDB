const mongoose = require('mongoose');

// Define the schema for resetpasswords
const resetPasswordSchema = new mongoose.Schema({
  id: {
    type: String, // Store UUID as a string
    required: true,
    unique: true, // Ensure UUID is unique
  },
  isActive: {
    type: Boolean, // Store as a boolean (0 = false, 1 = true)
    default: true, // Default value to true (active)
  },
  createdAt: {
    type: Date, // Date type for createdAt
    default: Date.now, // Automatically set the current timestamp
  },
  updatedAt: {
    type: Date, // Date type for updatedAt
    default: Date.now, // Automatically set the current timestamp
  },
  userId: {
    type: String, // Integer type for userId (same as in MySQL)
    required: true,
  },
});

// Create the model
const ResetPassword = mongoose.model('ResetPassword', resetPasswordSchema);

module.exports = ResetPassword;
