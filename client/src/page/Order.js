import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from "../context/ShopContext";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrderConfirmation() {
  const { currency, navigate, token } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState({});
  const [loadingItems, setLoadingItems] = useState({});

  useEffect(() => {
    const fetchMostRecentOrder = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.orders && response.data.orders.length > 0) {
          const recentOrder = response.data.orders[0];
          const itemsWithStatus = recentOrder.items.map(item => ({
            ...item,
            itemStatus: item.itemStatus || 'processing'
          }));
          setOrder({ ...recentOrder, items: itemsWithStatus });
        } else {
          setError('No orders found');
          toast.info('You have not placed any orders yet');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchMostRecentOrder();
  }, [token, navigate]);

  const fetchItemTracking = async (itemId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoadingItems(prev => ({ ...prev, [itemId]: true }));

    try {
      const response = await axios.get(`http://localhost:5000/api/orders/item/${itemId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTrackingInfo(prev => ({
          ...prev,
          [itemId]: response.data.trackingInfo
        }));
      } else {
        toast.error(response.data.message || 'Failed to fetch tracking info');
      }
    } catch (err) {
      console.error('Error fetching tracking info:', err);
      toast.error(err.response?.data?.message || 'Failed to load tracking information');
    } finally {
      setLoadingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6 text-center"><h2 className="text-xl">Loading order details...</h2></div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-xl text-red-500">Error loading order details</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 bg-blue-500 text-white p-2 rounded-md">
          Return to Home
        </button>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-md">
      {/* Order Summary */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Order Confirmation</h1>
        <p className="text-gray-600 mb-6">Thank you for your order! Your order number is #{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Details</h3>
            <div className="flex">
              <div className="w-1/2 font-medium text-gray-700">Order Date:</div>
              <div className="w-1/2">{orderDate}</div>
            </div>
            <div className="flex">
              <div className="w-1/2 font-medium text-gray-700">Payment Method:</div>
              <div className="w-1/2">{order.paymentMethod}</div>
            </div>
            {/* Removed order status from this section */}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="flex">
              <div className="w-1/2 font-medium text-gray-700">Subtotal:</div>
              <div className="w-1/2">{currency}{order.subtotal.toFixed(2)}</div>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex">
                <div className="w-1/2 font-medium text-gray-700">Delivery Fee:</div>
                <div className="w-1/2">{currency}{order.deliveryFee.toFixed(2)}</div>
              </div>
            )}
            <div className="flex border-t pt-2">
              <div className="w-1/2 font-bold text-gray-900">Total:</div>
              <div className="w-1/2 font-bold text-gray-900">{currency}{order.total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items - Now in 3 columns */}
      <div className="mb-8">
        <div className="space-y-6">
          {order.items.map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Column 1: Product Image */}
                <div className="p-4">
                  <img
                    className="w-full h-48 object-contain"
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>

                {/* Column 2: Combined Product Details */}
                <div className="p-4 border-t md:border-t-0 md:border-l">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Size:</span> {item.size}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Quantity:</span> {item.quantity}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Price:</span> {currency}{item.price.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Total:</span> {currency}{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Column 3: Status and Tracking */}
                <div className="p-4 bg-gray-50 border-t md:border-t-0 md:border-l">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.itemStatus)}`}>
                          {item.itemStatus.charAt(0).toUpperCase() + item.itemStatus.slice(1)}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => fetchItemTracking(item._id)}
                          disabled={loadingItems[item._id]}
                          className={`py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200 ${
                            loadingItems[item._id] ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {loadingItems[item._id] ? 'Loading...' : 'Track'}
                        </button>
                      </div>
                    </div>
                    
                    {trackingInfo[item._id] && (
                      <div className="p-2 bg-white rounded-md border text-xs">
                        <p className="font-medium">Tracking Info:</p>
                        <p>Carrier: {trackingInfo[item._id].carrier}</p>
                        <p>Tracking #: {trackingInfo[item._id].trackingNumber}</p>
                        <p>Status: {trackingInfo[item._id].status}</p>
                        <p>Updated: {new Date(trackingInfo[item._id].updatedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg transition-colors duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;