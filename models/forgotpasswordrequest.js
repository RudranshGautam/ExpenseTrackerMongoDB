const mongoose = require('mongoose');

// Define the schema for forgotpasswordrequests
const forgotPasswordRequestSchema = new mongoose.Schema({
  userId: {
    type: Number, // Integer type for userId
    required: true,
  },
  token: {
    type: String, // Token field, stored as a string
    required: true,
    unique: true, // Ensure the token is unique
  },
  status: {
    type: String, // Enum type for status (PENDING, COMPLETED, EXPIRED)
    enum: ['PENDING', 'COMPLETED', 'EXPIRED'],
    default: 'PENDING', // Default status is PENDING
  },
  created_at: {
    type: Date, // Date type for created_at
    default: Date.now, // Automatically set the current timestamp
  },
  updated_at: {
    type: Date, // Date type for updated_at
    default: Date.now, // Automatically set the current timestamp
  },
});



// Create the model
const ForgotPasswordRequest = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);

module.exports = ForgotPasswordRequest;
