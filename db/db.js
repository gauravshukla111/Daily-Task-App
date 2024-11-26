import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Make sure dotenv is required at the top

dotenv.config(); // Load environment variables

const uri = process.env.MONGO_URL; // Fetch from .env

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure code
  }
};

export default connectToMongoDB;
