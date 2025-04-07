import express from 'express';
import cors from 'cors';
import userRouter from './router/user.js';
import productRouter from './router/product.js';
import './config/db.js';
import dotenv from 'dotenv';
import cartRoutes from "./router/cartRout.js";
import orderRoutes from './router/order.js';
import paymentRoutes from './router/paymentRoutes.js';

dotenv.config();

const app = express();

// CORS setup
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());

// ➡️ REQUIRED: Root route handler
app.get('/', (req, res) => {
  res.json({
    status: 'API Online',
    message: 'Welcome to Yeabsi E-Commerce API',
    endpoints: {
      users: '/api/user',
      products: '/api/product',
      cart: '/api/cart',
      orders: '/api/orders',
      payment: '/api/payment'
    }
  });
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// ➡️ CRITICAL FOR VERCEL: Export the app as a serverless function
const vercelHandler = app;
export default vercelHandler;

// ➡️ Only run server locally when not in Vercel environment
if (process.env.VERCEL !== '1') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}