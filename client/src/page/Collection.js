import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { ShopContext } from '../context/ShopContext';
import Title from '../component/Title';

function Collection() {
  const { products, search, getProducts } = useContext(ShopContext);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('relavent');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getProducts();
  }, [products, getProducts]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Filter products by category and search query
  const filteredProducts = products
    .filter((product) =>
      (!selectedCategories.length || selectedCategories.includes(product.category)) &&
      (!search || product.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOption === 'high-low') return b.price - a.price;
      if (sortOption === 'low-high') return a.price - b.price;
      return 0;
    });

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-8 py-6 gap-6">
      {/* Filters Section */}
      <div className="md:w-1/6 p-4 m-7 md:mb-0 border-r-2 border-gray-300">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden bg-blue-500 text-white p-2 rounded-full w-full text-center"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className={`mt-4 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <p className="font-bold text-lg mb-2 text-gray-800">Filter</p>
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-2">Categories</p>
            {['Men', 'Women', 'Kids'].map((category) => (
              <label key={category} className="block text-gray-600 mb-2">
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-500"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products and Sorting Section */}
      <div className="w-full md:w-3/4 p-4">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="md:hidden flex">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 text-white p-2 rounded-full mr-2"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          <div className="flex-grow flex justify-center">
            <Title title1="All" title2="Collection" />
          </div>
          {/* Sorting Dropdown */}
          <div className="ml-4">
            <select
              className="border p-2 rounded shadow-sm text-gray-700 focus:ring focus:ring-blue-300"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="relavent">Relevant</option>
              <option value="high-low">High to Low</option>
              <option value="low-high">Low to High</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`} // Navigate to product details by ID
                className="bg-blue-100 border p-4 rounded shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : 'fallback-image.jpg'} // Fallback image if no images available
                  alt={product.name}
                  className="w-full h-full sm:h-60 md:h-72 lg:h-80 object-cover rounded-t-lg"
                />
                <h3 className="font-bold mt-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-500">{product.category}</p>
                <p className="font-bold text-blue-600">${product.price}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collection;
