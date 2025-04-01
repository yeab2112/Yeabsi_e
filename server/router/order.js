import express from 'express';
import  {createOrder,getUserOrders,getOrderById} from '../controller/orderController.js';
import authenticateUser from'../middleware/user.js';
import  authoAdmin from "../middleware/autho.js"

const orderRoutes= express.Router();

// Create a new order
orderRoutes.post('/', authenticateUser, createOrder);

// Get all orders for authenticated user
orderRoutes.get('/orders', authenticateUser, getUserOrders);

// Get specific order by ID
orderRoutes.get('/:id', authenticateUser, getOrderById);

export default orderRoutes;