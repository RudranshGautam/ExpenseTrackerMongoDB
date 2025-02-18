const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  
  name: {
    type: String,
    maxlength: 100,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;
