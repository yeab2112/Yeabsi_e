<div
  key={`${item._id}_${item.size}`}
  className="flex flex-col sm:flex-row items-center justify-between p-6 border-b rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex-shrink-0 flex-wrap"
>
  {/* Product Image */}
  <img
    src={item.image || '/placeholder-product.png'}
    alt={item.name}
    className="w-24 h-24 object-cover rounded-lg border border-gray-200 mb-4 sm:mb-0 sm:mr-6"
  />

  {/* Product Details */}
  <div className="flex-1 text-center sm:text-left">
    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
    <p className="text-gray-600">{currency}{item.price.toFixed(2)}</p>
    <p className="text-sm text-gray-500">Size: {item.size}</p>
  </div>

  {/* Quantity Controls */}
  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
    <button
      onClick={() => decreaseQuantity(item._id, item.size)}
      className="bg-gray-300 hover:bg-gray-400 p-2 rounded-full disabled:opacity-50"
      disabled={item.quantity <= 1}
    >
      <FaMinus className="text-gray-700" />
    </button>
    <span className="text-lg font-semibold min-w-[20px] text-center">
      {item.quantity}
    </span>
    <button
      onClick={() => increaseQuantity(item._id, item.size)}
      className="bg-gray-300 hover:bg-gray-400 p-2 rounded-full"
    >
      <FaPlus className="text-gray-700" />
    </button>
  </div>

  {/* Remove Item Button */}
  <button
    onClick={() => removeFromCart(item._id, item.size)}
    className="text-red-600 hover:text-red-800 p-3 rounded-full hover:bg-red-50 mt-4 sm:mt-0"
    aria-label="Remove item"
  >
    <FaTrash />
  </button>
</div>
