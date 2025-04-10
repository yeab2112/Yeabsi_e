import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

function Cart() {
  const { 
    cart, 
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    currency, 
    delivery_fee, 
    navigate
  } = useContext(ShopContext);

  const totalWithDelivery = cartTotal + delivery_fee;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8">Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>Your cart is empty.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item._id}_${item.size}`}
                className="flex flex-col sm:flex-row items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white"
              >
                {/* Product Image and Details */}
                <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                  <img
                    src={item.image || '/placeholder-product.png'}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{currency}{item.price.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </div>

                {/* Quantity Controls and Remove Button */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => decreaseQuantity(item._id, item.size)}
                      className="bg-gray-200 hover:bg-gray-300 p-1 sm:p-2 rounded-full disabled:opacity-50 transition"
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus className="text-xs sm:text-sm" />
                    </button>
                    <span className="text-sm sm:text-base font-semibold min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item._id, item.size)}
                      className="bg-gray-200 hover:bg-gray-300 p-1 sm:p-2 rounded-full transition"
                    >
                      <FaPlus className="text-xs sm:text-sm" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="text-red-600 hover:text-red-800 p-2 ml-4 rounded-full hover:bg-red-50 transition"
                    aria-label="Remove item"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-6 p-4 sm:p-6 border rounded-lg shadow-sm bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{currency}{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-medium">{currency}{delivery_fee.toFixed(2)}</span>
            </div>
            <hr className="my-3 border-gray-300" />
            <div className="flex justify-between text-lg sm:text-xl">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">
                {currency}{totalWithDelivery.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => navigate('/place-order')}
              className="w-full mt-4 sm:mt-6 bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium disabled:opacity-50"
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;