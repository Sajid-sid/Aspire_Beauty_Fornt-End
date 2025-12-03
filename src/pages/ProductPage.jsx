import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductById,
  clearSelectedProduct,
} from "../features/products/productSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct: product, loading } = useSelector(
    (state) => state.products
  );

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.image1) setMainImage(product.image1);
  }, [product]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );

  const allImages = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
  const isOutOfStock = !product.stock || product.stock <= 0;

  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = () => {
    dispatch(toggleWishlist(product));
  };

  const handleShare = () => {
    const url = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(url);
    alert("Product link copied!");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 mt-10 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* 🖼️ Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto rounded-xl shadow-md object-cover border border-gray-100 transition-all duration-300 ease-in-out"
              />
            ) : null}

          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index}`}
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition duration-300 ${mainImage === img
                  ? "border-2 border-[#03619E] opacity-100"
                  : "border-gray-200 opacity-80 hover:opacity-100"
                  }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center relative">
          {/* ❤️ Wishlist & Share buttons */}
          <div className="absolute top-0 right-0 flex gap-3">
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white border rounded-full shadow-sm hover:bg-[#E6F3FA] transition"
            >
              {inWishlist ? (
                <FaHeart className="w-5 h-5 text-[#03619E]" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-[#03619E]" />
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-2 bg-white border rounded-full shadow-sm hover:bg-[#E6F3FA] transition"
            >
              <FiShare2 className="w-5 h-5 text-[#03619E]" />
            </button>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800 mb-2 mt-8">
            {product.name}
          </h1>
          <p className="text-lg text-gray-500 mb-3">
            {product.category_name} • {product.producttype_name}
          </p>
          <p className="text-3xl font-bold text-[#03619E] mb-4">
            ₹{parseFloat(product.price).toFixed(2)}
          </p>

          {/* ✅ Add to Cart button with stock check */}
          <button
            disabled={isOutOfStock}
            className={`px-6 py-3 rounded-xl font-medium transition duration-300 shadow-sm ${isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#03619E] hover:bg-[#024C7B] text-white"
              }`}
            onClick={() =>
              !isOutOfStock &&
              alert(`Added ${product.name} to cart 🛒`)
            }
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* ✅ Stock info */}
          <p className="mt-4 text-sm text-gray-600">
            Stock:{" "}
            <span
              className={`${isOutOfStock ? "text-red-500" : "text-green-600"
                } font-medium`}
            >
              {isOutOfStock ? "Out of Stock" : `${product.stock} available`}
            </span>
          </p>
        </div>
      </div>

      {/*  Tabs Section */}
      <div className="mt-10 border-t border-gray-200 pt-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-5 py-2 rounded-lg border transition font-medium ${activeTab === "description"
              ? "bg-[#03619E] text-white border-[#03619E]"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`px-5 py-2 rounded-lg border transition font-medium ${activeTab === "ingredients"
              ? "bg-[#03619E] text-white border-[#03619E]"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            Ingredients
          </button>
        </div>

        {/* 👇 Tab Content */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === "description" && (
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: product.description || "No description available.",
              }}
            ></div>
          )}

          {activeTab === "ingredients" && (
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: product.ingredients || "No ingredients listed.",
              }}
            ></div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
