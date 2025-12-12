import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { setSingleCheckoutItem } from "../features/checkout/checkoutSlice";


const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

    const { token, user } = useSelector((state) => state.user);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => dispatch(addToCart(product));
  const handleIncrease = () => dispatch(increaseQuantity(product.id));
  const handleDecrease = () => dispatch(decreaseQuantity(product.id));
  const handleWishlistToggle = () => dispatch(toggleWishlist(product));

  

   const handleBuyNow = (item) => {
  if (!token || !user) {
    navigate("/user-login");
    return;
  }

  dispatch(setSingleCheckoutItem({ ...item, quantity: 1 }));
  navigate("/check-out?mode=single");
};


  // ⭐ FIXED SHARE FOR VERCEL
  const handleShare = () => {
    const url = `${window.location.origin}/product/${product.id}`;

    // If mobile browser supports Web Share API
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: "Check out this product!",
          url,
        })
        .catch(() => {
          navigator.clipboard.writeText(url);
          alert("Product link copied to clipboard!");
        });
    } else {
      // Fallback for Vercel / Desktop
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard!");
    }
  };

  return (
  <div className="relative flex flex-col bg-white border border-gray-100 shadow-md rounded-2xl p-3 transition-all duration-300 hover:shadow-lg w-full max-w-xs sm:max-w-sm">

    {/* 🖼️ Product Image + Wishlist + Share */}
    <div className="relative w-full flex justify-center">
      <Link to={`/product/${product.id}`} className="w-full flex justify-center">
        <div className="w-32 sm:w-40 md:w-44 lg:w-48 aspect-square relative">
          <img
            src={product.image1}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain rounded-lg border border-gray-100"
          />
        </div>
      </Link>

      {/* ❤️ Wishlist & Share Over Image */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          {inWishlist ? (
            <FaHeart className="w-5 h-5 text-[#FF5757]" />
          ) : (
            <FaRegHeart className="w-5 h-5 text-[#001B3D]" />
          )}
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <FiShare2 className="w-5 h-5 text-[#001B3D]" />
        </button>
      </div>
    </div>

    {/* Product Details */}
    <div className="mt-3 w-full">
      <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">
        {product.name}
      </p>
      <p className="text-xs sm:text-sm text-gray-500">{product.category_name}</p>
      <p className="font-semibold mt-1 text-[#001B3D] text-sm sm:text-base">
        ₹{product.price}
      </p>
    </div>

    {/* Cart Controls */}
    <div className="mt-3 w-full flex justify-center">
      {cartItem ? (
        <div className="flex items-center gap-2 bg-[#001B3D] text-white rounded-lg px-3 py-1 text-sm sm:text-base">
          <button onClick={handleDecrease} className="font-bold px-1">−</button>
          <span className="font-medium">{cartItem.quantity}</span>
          <button onClick={handleIncrease} className="font-bold px-1">+</button>
        </div>
      ) : product.stock === 0 ? (
        <button
          disabled
          className="w-full text-center text-white px-3 py-2 rounded-lg text-sm font-medium bg-gray-400 cursor-not-allowed"
        >
          Out of Stock
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full flex justify-center items-center gap-2 text-white px-3 py-2 rounded-lg text-sm font-medium bg-[#001B3D] hover:bg-[#00132A]"
        >
          <FaShoppingCart className="text-sm" />
          Add to Cart
        </button>
      )}
    </div>

    {/* ⭐ BUY NOW BUTTON — Mobile stacked / Desktop side-by-side */}
    <div className="mt-2 w-full flex flex-col sm:flex-row gap-2">

      {/* Add to Cart (Desktop only duplicate hidden on mobile?) */}
      {/* IF YOU WANT ONLY ONE BUTTON, REMOVE ABOVE cart controls */}

      <button
        onClick={() => handleBuyNow(product)}
        className="w-full bg-[#FF6B32] hover:bg-[#E65A28] text-white py-2 rounded-lg text-sm font-semibold transition"
      >
        Buy Now
      </button>
    </div>

  </div>
);

};

export default ProductCard;
