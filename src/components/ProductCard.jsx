import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => dispatch(addToCart(product));
  const handleIncrease = () => dispatch(increaseQuantity(product.id));
  const handleDecrease = () => dispatch(decreaseQuantity(product.id));
  const handleWishlistToggle = () => dispatch(toggleWishlist(product));

  const handleShare = () => {
    const url = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: "Check out this product!",
          url,
        })
        .catch((error) => console.error("Share failed:", error));
    } else {
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard!");
    }
  };

  return (
    <div className="relative flex flex-col items-center text-start bg-white border border-gray-100 shadow-md rounded-2xl p-3 transition-all duration-300 hover:shadow-lg w-full max-w-xs sm:max-w-sm">

      {/* 🖼️ Product Image */}
      <Link to={`/product/${product.id}`} className="w-full flex justify-center">
        <div className="w-32 sm:w-40 md:w-44 lg:w-48 aspect-square relative">
          <img
            src={product.image1}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain rounded-lg border border-gray-100 transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      {/* 📦 Product Info */}
      <div className="mt-3 w-full text-center sm:text-left">
        <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">
          {product.name}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">{product.category_name}</p>
        <p className="font-semibold mt-1 text-[#001B3D] text-sm sm:text-base">
          ₹{product.price}
        </p>
      </div>

      {/* ❤️ Wishlist, 🔗 Share, 🛒 Cart */}
      <div className="flex justify-between items-center w-full mt-3">

        {/* ❤️ Wishlist & Share */}
        <div className="flex gap-2 sm:gap-3">
          <button
            className="p-2 bg-white rounded-full shadow-sm hover:bg-[#E6F3FA] transition"
            onClick={handleWishlistToggle}
          >
            {inWishlist ? (
              <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5757]" />
            ) : (
              <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5 text-[#001B3D]" />
            )}
          </button>

          <button
            className="p-2 bg-white rounded-full shadow-sm hover:bg-[#E6F3FA] transition"
            onClick={handleShare}
          >
            <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#001B3D]" />
          </button>
        </div>

        {/* 🛒 Cart Controls */}
        {cartItem ? (
          <div className="flex items-center gap-2 bg-[#001B3D] text-white rounded-lg px-3 py-1 text-sm sm:text-base">
            <button
              onClick={handleDecrease}
              className="font-bold px-1 hover:text-gray-200"
            >
              −
            </button>
            <span className="font-medium">{cartItem.quantity}</span>
            <button
              onClick={handleIncrease}
              className="font-bold px-1 hover:text-gray-200"
            >
              +
            </button>
          </div>
        ) : product.stock === 0 ? (
          <button
            disabled
            className="flex items-center gap-1 sm:gap-2 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-400 cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 sm:gap-2 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 bg-[#001B3D] hover:bg-[#00132A]"
          >
            <FaShoppingCart className="text-xs sm:text-sm" />
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
