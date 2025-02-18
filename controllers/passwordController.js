const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user'); // Import User model
const ResetPassword = require('../models/resetpassword'); // Import ResetPassword model
const sendEmail = require('../utils/emailSender'); // Utility function for sending emails

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }
        const resetId = uuidv4();
        const resetRequest = new ResetPassword({
            id: resetId, // Store UUID
            userId: user._id.toString(), // Store user ID
            isActive: true, // Mark as active
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Save reset request in the database
        await resetRequest.save();
        // Generate reset link
        const resetLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(email)}`;

        // Send email with the reset link
        await sendEmail(
            email,
            'Password Reset',
            `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
        );

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }
    try {  
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found with email: ${email}`);
            return res.status(404).json({ message: 'User not found' });
        }
        const resetRequest = await ResetPassword.findOne({ userId: user.id, isActive: true });
        if (!resetRequest) {
                       return res.status(404).json({ message: 'Invalid or expired reset request' });
        }
         const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        resetRequest.isActive = false;  // Ensuring it's set to false after reset
        resetRequest.updatedAt = new Date();  // Update the timestamp
        await resetRequest.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
