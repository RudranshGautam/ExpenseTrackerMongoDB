const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
require('dotenv').config();

// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ success: true, token, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
