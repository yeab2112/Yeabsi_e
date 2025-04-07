import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import { TrashIcon } from '@heroicons/react/outline'; // This will work with Heroicons v1

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the product data from the backend API
    const fetchProducts = async () => {
      try {
        const atoken = localStorage.getItem('atoken'); // Assuming token is stored in localStorage
        const response = await axios.get('http://localhost:5000/api/product/list_products', {
          headers: {
            Authorization: `Bearer ${atoken}`,
          },
        });

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError('Failed to fetch products');
          toast.error('Failed to fetch products'); // Show error toast
        }
      } catch (err) {
        setError('An error occurred while fetching the products');
        toast.error('An error occurred while fetching the products'); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle deleting a product
  const handleDelete = async (productId) => {
    try {
      const atoken = localStorage.getItem('atoken'); // Assuming token is stored in localStorage
      const response = await axios.delete(`http://localhost:5000/api/product/delete_product/${productId}`, {
        headers: {
          Authorization: `Bearer ${atoken}`,
        },
      });

      if (response.data.success) {
        // Remove the deleted product from the state
        setProducts(products.filter((product) => product._id !== productId));
        toast.success('Product deleted successfully'); // Show success toast
      } else {
        setError('Failed to delete the product');
        toast.error('Failed to delete the product'); // Show error toast
      }
    } catch (err) {
      setError('An error occurred while deleting the product');
      toast.error('An error occurred while deleting the product'); // Show error toast
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Title for Product List */}
      <h1 className="text-3xl font-bold text-center mb-6">Product List</h1>

      {/* Column Titles (Image, Name, Category, Price, Action) */}
      <div className="grid grid-cols-6 gap-4 mb-4 border-b-4 pb-2">
        <span className="font-semibold text-center">Image</span>
        <span className="font-semibold text-center">Name</span>
        <span className="font-semibold text-center">Category</span>
        <span className="font-semibold text-center">Price</span>
        <span className="font-semibold text-center">Action</span>
      </div>

      {/* Product Details */}
      {products.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No products available</div>
      ) : (
        products.map((product) => (
          <div key={product._id} className="grid grid-cols-6 gap-4 py-4 border-b">
            <img
              src={product.images[0]} // Display the first image from the array
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md mx-auto"
            />
            <span className="text-center">{product.name}</span>
            <span className="text-center">{product.category}</span>
            <span className="text-center">${product.price}</span>
            <div className="flex justify-center">
              <TrashIcon
                onClick={() => handleDelete(product._id)} // Call delete function on click
                className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-600" // Icon style
              />
            </div>
          </div>
        ))
      )}

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop />
    </div>
  );
};

export default List;
