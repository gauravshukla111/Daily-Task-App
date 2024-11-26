import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import middleware from '../middleware/middleware.js';
import dotenv from 'dotenv';

dotenv.config(); // Use import for dotenv

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();

        return res.status(201).json({ success: true, message: "Account created successfully" });

    } catch (error) {
        console.error("Error registering user:", error.message);
        return res.status(500).json({ success: false, message: "Error registering user" });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Email does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "5h" });

        return res.status(200).json({
            success: true,
            token,
            user: { name: user.name },
            message: "Login successful",
        });

    } catch (error) {
        console.error("Error logging in:", error.message);
        return res.status(500).json({ success: false, message: "Error logging in" });
    }
});

// Verify Token
router.get('/verify', middleware, async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
});

export default router;
