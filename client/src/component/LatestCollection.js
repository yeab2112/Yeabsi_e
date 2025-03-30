import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext'; // Importing context to get products and getProducts
import { Link } from 'react-router-dom';
import Title from './Title'; // Assuming this is a component that displays the page title
import { toast } from 'react-toastify'; // For showing success or error messages

function LatestCollection() {
  const { products, getProducts } = useContext(ShopContext); // Accessing products and getProducts from context
  const [loading, setLoading] = useState(true); // Loading state to show a loading message while fetching data

  // Using useCallback to prevent unnecessary re-creations of fetchProducts function
  const fetchProducts = useCallback(async () => {
    setLoading(true); // Set loading to true before making the API call
    try {
      await getProducts(); // Fetch products from the context (or API)
      toast.success('Products loaded successfully!'); // Show success message on success
    } catch (error) {
      toast.error('Failed to load products!'); // Show error message if fetch fails
    } finally {
      setLoading(false); // Set loading to false after data is fetched or an error occurs
    }
  }, [getProducts]); // Only recreate fetchProducts if getProducts changes

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts(); // Fetch products only if products list is empty
    } else {
      setLoading(false); // If products are already available, set loading to false
    }
  }, [products]); // This effect depends on products and fetchProducts

  // If products are still loading, show the "Loading..." message
  if (loading) {
    return <div className="text-center py-10 text-xl text-gray-600">Loading products...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <Title title1="Latest" title2="Collection" />
      <div className="text-center mb-6 text-gray-600">
        <p className="text-lg font-medium text-gray-700 mt-2">
          Explore the newest products in our collection.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product._id} // Use product ID as key for each product
              to={`/product/${product._id}`} // Link to individual product details page
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow group"
            >
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : 'fallback-image.jpg'} // Fallback image if no images available
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-lg font-semibold text-gray-700 mt-4 group-hover:text-blue-600">
                {product.name} {/* Product name */}
              </h3>
              {product.price && (
                <p className="text-xl font-bold text-green-800 mt-2">
                  ${product.price} {/* Product price */}
                </p>
              )}
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No products available in the collection.
          </p>
        )}
      </div>
    </div>
  );
}

export default LatestCollection;
