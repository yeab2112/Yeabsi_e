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

  // Calculate total with delivery
  const totalWithDelivery = cartTotal + delivery_fee;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-8">Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={`${item._id}_${item.size}`}
                className="flex flex-col sm:flex-col  md:flex-row items-center justify-between p-6 border-b rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
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
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-8 p-6 border rounded-lg shadow-lg bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{currency}{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-medium">{currency}{delivery_fee.toFixed(2)}</span>
            </div>
            <hr className="my-3 border-gray-300" />
            <div className="flex justify-between text-xl">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">
                {currency}{totalWithDelivery.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => navigate('/place-order')}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
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
