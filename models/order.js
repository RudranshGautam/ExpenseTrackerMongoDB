const mongoose = require('mongoose');

// Define the schema for orders
const orderSchema = new mongoose.Schema({
  user_id: {
    type: String, // Assuming `user_id` is an integer
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESSFUL'], // Add other statuses if needed
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save middleware to update the `updated_at` field


// Create the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
