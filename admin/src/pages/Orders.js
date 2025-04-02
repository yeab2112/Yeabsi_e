import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Orders() {
  const atoken = localStorage.getItem('atoken'); 

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [isUpdating, setIsUpdating] = useState({});

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/orders/allOrder',
          {
            headers: {
              'Authorization': `Bearer ${atoken}`
            }
          }
        );

        if (response.data.success) {
          const ordersWithStatus = response.data.orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
              ...item,
              status: item.status || 'pending'
            }))
          }));
          setOrders(ordersWithStatus);
        } else {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [atoken]);

  const updateItemStatus = async (orderId, productId, size, newStatus) => {
    const itemKey = `${orderId}-${productId}-${size}`;
    setIsUpdating(prev => ({ ...prev, [itemKey]: true }));

    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { productId, size, status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${atoken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? {
                ...order,
                items: order.items.map(item => 
                  item._id === productId && item.size === size
                    ? { ...item, status: newStatus }
                    : item
                )
              }
            : order
        ));
        toast.success(`Status updated to ${newStatus}`);
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(prev => ({ ...prev, [itemKey]: false }));
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.deliveryInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${order.deliveryInfo.firstName} ${order.deliveryInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-xl">Loading orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-xl text-red-500">Error loading orders</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Orders Dashboard</h1>
      
      {/* Search Bar */}
      <div className="mb-6 sticky top-0 bg-white py-2 z-10">
        <input
          type="text"
          placeholder="Search orders by ID, email or name..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-6 mb-8 max-h-[600px] overflow-y-auto">
        {currentOrders.length > 0 ? (
          currentOrders.map(order => {
            const orderDate = new Date(order.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={order._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                      <p className="text-sm text-gray-600">Placed on {orderDate}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <p className="text-sm">
                        <span className="font-medium">Customer:</span> {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {order.deliveryInfo.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items - Scrollable Container */}
                <div className="p-4 max-h-[500px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item, index) => {
                        const itemKey = `${order._id}-${item._id}-${item.size}`;
                        return (
                          <tr key={index}>
                            {/* Product Column */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-16 w-16">
                                  <img
                                    className="h-full w-full object-contain"
                                    src={item.image || '/placeholder-product.jpg'}
                                    alt={item.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                                </div>
                              </div>
                            </td>

                            {/* Details Column */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <p><strong>Size:</strong> {item.size}</p>
                                <p><strong>Qty:</strong> {item.quantity}</p>
                                <p><strong>Total:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              {isUpdating[itemKey] ? (
                                <span className="text-sm text-gray-500">Updating...</span>
                              ) : (
                                <select
                                  value={item.status}
                                  onChange={(e) => updateItemStatus(order._id, item._id, item.size, e.target.value)}
                                  className={`border rounded-md p-1 text-sm ${
                                    item.status === 'pending' ? 'border-yellow-300 bg-yellow-50' :
                                    item.status === 'processing' ? 'border-blue-300 bg-blue-50' :
                                    item.status === 'shipped' ? 'border-purple-300 bg-purple-50' :
                                    item.status === 'delivered' ? 'border-green-300 bg-green-50' :
                                    'border-red-300 bg-red-50'
                                  }`}
                                  disabled={isUpdating[itemKey]}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="mb-2 md:mb-0">
                      <p className="text-sm">
                        <strong>Payment Method:</strong> {order.paymentMethod}
                      </p>
                      <p className="text-sm">
                        <strong>Delivery Address:</strong> {order.deliveryInfo.address}, {order.deliveryInfo.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}
                      </p>
                      <p className="text-sm">
                        <strong>Delivery Fee:</strong> ${order.deliveryFee.toFixed(2)}
                      </p>
                      <p className="text-lg font-bold">
                        <strong>Total:</strong> ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 w-full bg-white py-4 border-t border-gray-200">
        <div className="flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 border text-sm font-medium ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} hover:bg-gray-50`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Orders;
