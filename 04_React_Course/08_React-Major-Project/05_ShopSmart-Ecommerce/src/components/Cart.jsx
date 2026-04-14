import React, { useContext } from "react";
import { storecontext } from "./Context";

const Cart = () => {
  const { cart, setCart, qtyhandler, removeItem } = useContext(storecontext);

  return (
    <div className="min-h-screen mt-17 bg-gray-100 flex justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 cursor-pointer py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                    disabled={item.qty <= 1}
                    onClick={() => qtyhandler(item.id, 2)}
                  >
                    -
                  </button>
                  <span className="px-3">{item.qty}</span>
                  <button
                    className="px-2 py-1 bg-gray-300 cursor-pointer rounded-lg hover:bg-gray-400"
                    onClick={() => qtyhandler(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="ml-4 px-3 py-1 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
