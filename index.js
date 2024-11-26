import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Ensure dotenv is required
import connectToMongoDB from './db/db.js'; // Correct path to db.js
import authRouter from './routes/auth.js'; // Replace with actual auth routes
import noteRouter from './routes/note.js'; // Replace with actual note routes

dotenv.config(); // Load environment variables

const app = express();

// Connect to MongoDB Atlas
connectToMongoDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);

// Start Server
const PORT = process.env.PORT || 5000; // Use environment variable for port, default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
