import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  if (wishlist.length === 0) {
    return (
      <p className="text-center mt-20 text-[#001b3d] text-lg">
        Your wishlist is empty 💔
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#001b3d]">
        Your Wishlist
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="relative border rounded-lg p-4 text-center hover:shadow-lg transition bg-white"
          >
            {/* ❤️ Corel Red heart icon */}
            <button
              onClick={() => dispatch(removeFromWishlist(product.id))}
              className="absolute top-3 right-3 text-[#ff5757] hover:scale-110 transition-transform"
            >
              <FaHeart size={20} />
            </button>

            <img
              src={product.image1}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-2"
            />

            <h3 className="font-semibold text-sm text-[#001b3d]">
              {product.name}
            </h3>

            <p className="text-gray-600">₹{product.price}</p>

            <div className="mt-3">
              <Link
                to={`/product/${product.id}`}
                className="underline text-[#001b3d] hover:text-[#ff5757] transition"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
