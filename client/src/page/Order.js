import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from "../context/ShopContext";
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrderConfirmation() {
  const { currency, navigate, token } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get order ID from URL params or location state
  const { id } = useParams();
  const location = useLocation();
  const orderId = id || location.state?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          // Ensure each item has a status (default to 'pending' if not set)
          const orderWithStatus = {
            ...response.data.order,
            items: response.data.order.items.map(item => ({
              ...item,
              status: item.status || 'pending'
            }))
          };
          setOrder(orderWithStatus);
        } else {
          throw new Error(response.data.message || 'Failed to fetch order');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || err.message);
        toast.error('Failed to load order details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, navigate]);

  const handleTrackOrder = async (productId, size, currentStatus) => {
    try {
      const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];
      const currentIndex = statusFlow.indexOf(currentStatus);
      const nextStatus = currentIndex < statusFlow.length - 1 
        ? statusFlow[currentIndex + 1] 
        : statusFlow[statusFlow.length - 1];

      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/items`,
        { productId, size, status: nextStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrder(prev => ({
          ...prev,
          items: prev.items.map(item => 
            item._id === productId && item.size === size 
              ? { ...item, status: nextStatus } 
              : item
          )
        }));
        toast.success(`Item status updated to ${nextStatus}`);
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-xl">Loading order details...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-xl text-red-500">Error loading order details</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Format order date
  const orderDate = new Date(order.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-md">
      {/* Delivery Information */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><strong className="text-gray-700">Name:</strong> {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
            <p><strong className="text-gray-700">Email:</strong> {order.deliveryInfo.email}</p>
            <p><strong className="text-gray-700">Phone:</strong> {order.deliveryInfo.phone}</p>
          </div>
          <div className="space-y-2">
            <p><strong className="text-gray-700">Address:</strong> {order.deliveryInfo.address}</p>
            <p>{order.deliveryInfo.city}, {order.deliveryInfo.state} {order.deliveryInfo.zipCode}</p>
            <p><strong className="text-gray-700">Country:</strong> {order.deliveryInfo.country}</p>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <tr key={index}>
                {/* Product Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-20 w-20">
                      <img 
                        className="h-full w-full object-contain rounded-md"
                        src={item.image|| '/placeholder-product.jpg'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{currency}{item.price.toFixed(2)}</div>
                    </div>
                  </div>
                </td>

                {/* Details Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <p><strong>Size:</strong> {item.size}</p>
                    <p><strong>Qty:</strong> {item.quantity}</p>
                    <p><strong>Total:</strong> {currency}{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <p><strong>Payment:</strong> {order.paymentMethod}</p>
                    <p><strong>Order Date:</strong> {orderDate}</p>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>

                {/* Track Order Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleTrackOrder(item._id, item.size, item.status)}
                    disabled={item.status === 'delivered'}
                    className={`px-4 py-2 rounded-md text-white ${
                      item.status === 'delivered' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {item.status === 'delivered' ? 'Completed' : 'Track Order'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Summary */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Subtotal:</p>
            <p className="text-lg font-medium">{currency}{order.subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Delivery Fee:</p>
            <p className="text-lg font-medium">{currency}{order.deliveryFee.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Total:</p>
            <p className="text-xl font-bold">{currency}{order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-green-600">Thank you for your order!</h2>
        <p className="text-lg mt-2">Your order #{order._id} has been confirmed.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;