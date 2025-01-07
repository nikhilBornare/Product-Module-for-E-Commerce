import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Start the Server
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));