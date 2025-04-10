import express from 'express';
import{ createOrder,getOrderStatus, getUserOrders,getAllOrders,updateOrderStatus} from '../controller/orderController.js';
import authenticateUser from '../middleware/user.js';
import authoAdmin from "../middleware/autho.js";

const orderRoutes = express.Router();

// Create a new order
orderRoutes.post('/', authenticateUser, createOrder);

// Get all orders for authenticated user
orderRoutes.get('/user', authenticateUser, getUserOrders);
orderRoutes.get('/:orderId/status', authenticateUser, getOrderStatus);
// Admin route to get all orders
orderRoutes.get('/allOrder', authoAdmin, getAllOrders);

// Admin route to update order status
orderRoutes.put('/status/:orderId', authoAdmin, updateOrderStatus);

export default orderRoutes;