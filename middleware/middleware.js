import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config(); // Use import syntax for dotenv

const middleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = { name: user.name, id: user._id };
        next();

    } catch (error) {
        console.error("Error in middleware:", error.message);
        return res.status(500).json({ success: false, message: "Please login" });
    }
};

export default middleware;
