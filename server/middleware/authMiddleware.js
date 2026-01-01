import User from "../models/User.js";

export const authUser = async (req, res, next) => {
    try {
        const { userId } = req.auth(); // Make sure this returns { userId }
        if (!userId) {
            return res.json({ success: false, message: 'Not Authenticated' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
