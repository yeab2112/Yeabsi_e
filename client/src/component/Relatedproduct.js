import React from 'react';
import { Link } from 'react-router-dom'; 

const RelatedProduct = ({ category, currentProductId, products }) => {
  // Filter related products: same category but different ID
  const relatedProducts = products.filter(
    product => product.category === category && product._id !== currentProductId
  );

  // Don't render if no related products
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className=" text-center text-xl font-semibold mb-6">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <Link 
            to={`/product/${product._id}`} // Adjust this path to match your route
            key={product._id}
            className="block border rounded-lg p-4 hover:shadow-lg transition-shadow hover:no-underline"
          >
            <img 
              src={product.images?.[0] || ''} 
              alt={product.name}
              className="w-full h-48 object-contain mb-4"
            />
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <p className="text-gray-600">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;