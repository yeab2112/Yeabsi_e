import express from 'express';
const cartRoutes = express.Router();
import {
  getCart,
  addToCart,
  updateCartItem,
} from '../controller/cartController.js';
import authenticateUser from '../middleware/user.js';

cartRoutes.get('/cart_list', authenticateUser, getCart);

cartRoutes.post('/add', authenticateUser, addToCart);
cartRoutes.get('/get', authenticateUser, getCart);

// Change your backend route to:
cartRoutes.put('/update', authenticateUser, updateCartItem); // Remove :productId from route

// Then in your updateCartItem controller:
export default cartRoutes;
