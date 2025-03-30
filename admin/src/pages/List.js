import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TrashIcon } from '@heroicons/react/outline';
import { Dialog } from '@headlessui/react';

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const atoken = localStorage.getItem('atoken');
        if (!atoken) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:5000/api/product/list_products', {
          headers: {
            Authorization: `Bearer ${atoken}`,
          },
        });

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const atoken = localStorage.getItem('atoken');
      if (!atoken) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(
        `http://localhost:5000/api/product/delete_product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${atoken}`,
          },
        }
      );

      if (response.data.success) {
        setProducts(products.filter((product) => product._id !== productId));
        toast.success('Product deleted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      handleDelete(productToDelete);
      setIsDeleteModalOpen(false);
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
      <h1 className="text-3xl font-bold text-center mb-6">Product List</h1>

      <div className="grid grid-cols-6 gap-4 mb-4 border-b-4 pb-2">
        <span className="font-semibold text-center">Image</span>
        <span className="font-semibold text-center">Name</span>
        <span className="font-semibold text-center">Category</span>
        <span className="font-semibold text-center">Price</span>
        <span className="font-semibold text-center">Action</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No products available</div>
      ) : (
        products.map((product) => (
          <div key={product._id} className="grid grid-cols-6 gap-4 py-4 border-b">
            <img
              src={product.images[0] || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md mx-auto"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            <span className="text-center">{product.name}</span>
            <span className="text-center">{product.category}</span>
            <span className="text-center">${product.price}</span>
            <div className="flex justify-center">
              <TrashIcon
                onClick={() => openDeleteModal(product._id)}
                className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-600"
              />
            </div>
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Confirm Deletion
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">
              Are you sure you want to delete this product? This action cannot be undone.
            </Dialog.Description>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className=" bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop />
    </div>
  );
};

export default List;