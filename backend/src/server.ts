import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns';
import { protect } from './middleware/auth';
import allRoutes from './routes/index'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL ?? "", "https://intern-fund.vercel.app", "http://localhost:5173"],
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

app.use('/api', allRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/campaigns', campaignRoutes);


// Protected Test Route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});