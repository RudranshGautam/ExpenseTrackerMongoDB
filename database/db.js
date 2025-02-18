const mongoose = require('mongoose');

const dbURI = ''; // Your connection string


const connectDB = async () => {
  try {
   
    await mongoose.connect(dbURI)

    console.log('MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  }
};
module.exports = connectDB;
