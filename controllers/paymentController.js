const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.userId;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paisa
            currency: 'INR',
            receipt: `order_${new Date().getTime()}`,
        });

        // Save order details to MongoDB
        await Order.create({
            user_id: userId,
            order_id: order.id,
            amount,
            status: 'PENDING',
        });

        res.status(200).json({ orderId: order.id });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify the payment signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Fetch the order from the database
            const order = await Order.findOne({ order_id: razorpay_order_id });

            if (order) {
                // Update order status and user's premium status
                await Order.findOneAndUpdate(
                    { order_id: razorpay_order_id },
                    { status: 'SUCCESSFUL', updated_at: new Date() }
                );

                await User.findOneAndUpdate(
                    { _id: order.user_id },
                    { isPremium: true }
                );

                return res.status(200).json({ message: 'Payment verified. Premium activated!' });
            }

            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(400).json({ message: 'Invalid payment signature' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
