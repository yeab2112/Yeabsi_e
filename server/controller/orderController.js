import  Order  from "../moduls/order.js";
import { UserModel } from "../moduls/user.js";
// Create a new order
 const createOrder = async (req, res) => {
  try {
    const { deliveryInfo, paymentMethod, items, subtotal, deliveryFee, total } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!deliveryInfo || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    // Create new order
    const order = new Order({
      user: userId,
      deliveryInfo,
      paymentMethod,
      items,
      subtotal,
      deliveryFee,
      total,
      status: 'pending'
    });

    // Save order to database
    await order.save();

    // Clear user's cart after successful order
    await UserModel.findByIdAndUpdate(userId, { cartdata: {} });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get orders for authenticated use
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'items.productId',
        select: 'name price images'
      });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No orders found',
        orders: []
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

const getAllOrders = (async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, orders });
});

const updateOrderItemStatus = (async (req, res) => {
  const { productId, size, status } = req.body;
  
  const order = await Order.findById(req.params.orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Find and update the specific item
  const itemIndex = order.items.findIndex(
    item => item._id.toString() === productId && item.size === size
  );
  
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Order item not found');
  }
  
  order.items[itemIndex].status = status;
  const updatedOrder = await order.save();
  
  res.json({ 
    success: true, 
    order: updatedOrder,
    message: 'Item status updated successfully'
  });
});


export { createOrder,getUserOrders, getAllOrders,updateOrderItemStatus}

