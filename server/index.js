import express from 'express';
import cors from 'cors';
import userRouter from './router/user.js'; 
import productRouter from './router/product.js';
import './config/db.js'; // Ensures the DB connection is established
import dotenv from 'dotenv';
import  cartRoutes from "./router/cartRout.js"
dotenv.config(); // Load environment variables

const app = express();

// CORS setup (can restrict in production)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*', // Default to all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Explicitly allow PATCH

  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());  // No need for bodyParser if using express.json

// Set up routers
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRoutes); // This creates /api/cart/update/:productId

// Set up port with fallback
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
