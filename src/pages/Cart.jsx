import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  decreaseQuantity,
  addToCart,
  clearCart,
} from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { setSingleCheckoutItem } from "../features/checkout/checkoutSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.user);

  const primary = "#001B3D";
  const secondary = "#FF5757";

  if (items.length === 0)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg tracking-wide">
          Your cart is empty 🛍️
        </p>
      </div>
    );

  const handleCheckout = () => {
    if (!token || !user) {
      navigate("/user-login");
      return;
    }
    dispatch(setSingleCheckoutItem(null));
    navigate("/check-out?mode=cart");
  };

  const handleBuySingle = (item) => {
    if (!token || !user) {
      navigate("/user-login");
      return;
    }
    dispatch(setSingleCheckoutItem({ ...item, quantity: 1 }));
    navigate("/check-out?mode=single");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-3xl font-semibold text-[#001B3D] tracking-tight">
          Your Cart
        </h2>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-[#FF5757] hover:text-red-600 underline underline-offset-4"
        >
          Clear Cart
        </button>
      </div>

      <p className="text-gray-700 mb-6">Items in cart: {totalItems}</p>

      {/* Cart Items */}
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-gray-200 gap-4"
          >
            {/* Left Section */}
            <div className="flex gap-4 flex-1">
              <img
                src={item.image1}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <p className="text-lg font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-600 text-sm mt-1">₹{item.price}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="w-8 h-8 border border-[#001B3D] flex items-center justify-center rounded hover:bg-[#001B3D] hover:text-white transition"
                  >
                    −
                  </button>
                  <span className="text-gray-800 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="w-8 h-8 border border-[#001B3D] flex items-center justify-center rounded hover:bg-[#001B3D] hover:text-white transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-[#FF5757] hover:text-red-600 text-sm underline underline-offset-4"
              >
                Remove
              </button>
              <button
                onClick={() => handleBuySingle(item)}
                className="text-sm bg-[#001B3D] text-white px-4 py-1 rounded-md hover:bg-[#00112A] transition"
              >
                Buy This Item
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Area */}
      <div className="mt-10 bg-[#F1F5F9] p-6 border border-gray-200 rounded-lg text-right">
        <p className="text-xl font-medium text-gray-900">
          Total: <span className="text-[#001B3D]">₹{totalAmount.toFixed(2)}</span>
        </p>

        <button
          onClick={handleCheckout}
          className="mt-5 w-full sm:w-auto bg-[#001B3D] hover:bg-[#00112A] text-white px-7 py-3 rounded-md transition shadow-sm"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
