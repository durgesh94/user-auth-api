import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());

// MongoDB connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);

export default app;
