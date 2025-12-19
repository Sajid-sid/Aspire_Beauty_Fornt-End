import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from "react-icons/fa";
import { setSingleCheckoutItem } from "../features/checkout/checkoutSlice";
import { FiShare2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.products.items || []);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const product = products.find((p) => p.id === parseInt(id));
  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qtyMap, setQtyMap] = useState({});
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    if (!product) return;

    const firstVariant = product.variants?.[0] || null;
    setSelectedVariant(firstVariant);

    const images = [
      firstVariant?.product_image,
      ...[product.image1, product.image2, product.image3, product.image4].filter(Boolean),
    ];
    setGalleryImages(images);
    setMainImage(firstVariant?.product_image || product.image1 || "");

    // Map cart quantities per variant
    const map = {};
    cartItems.forEach((item) => {
      const vid = item.selectedVariant?.variantId || item.productId;
      map[vid] = item.quantity;
    });
    setQtyMap(map);
  }, [product, cartItems]);

  if (!product) return <div className="text-center mt-20">Product not found</div>;

  const variantStock = selectedVariant?.stock || product.total_stock || 0;
  const isOutOfStock = variantStock <= 0;
  const qty = selectedVariant ? qtyMap[selectedVariant.variantId] || 0 : 0;

  // ✅ Check wishlist per product + variant
  const inWishlist = selectedVariant
    ? wishlistItems.some(
        (item) =>
          item.id === product.id &&
          item.selectedVariant?.variantId === selectedVariant.variantId
      )
    : false;

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);

    const images = [
      variant.product_image,
      ...[product.image1, product.image2, product.image3, product.image4].filter(Boolean),
    ];
    setGalleryImages(images);
    setMainImage(variant.product_image || product.image1 || "");
  };


  const handleBuyNow = () => {
  if (!selectedVariant || isOutOfStock) return;

  dispatch(
    setSingleCheckoutItem({
      productId: product.id,
      name: product.name,
      quantity: 1,

      // ✅ IMPORTANT: VARIANT IMAGE FIRST
      image:
        selectedVariant.product_image ||
        selectedVariant.variant_image ||
        product.image1,

      price: selectedVariant.price || product.price,

      selectedVariant: {
        variantId: selectedVariant.variantId,
        variant: selectedVariant.label || selectedVariant.variant,
        price: selectedVariant.price || product.price,
        stock: selectedVariant.stock,

        // ✅ THIS FIXES YOUR IMAGE ISSUE
        product_image:
          selectedVariant.product_image ||
          selectedVariant.variant_image ||
          product.image1,

        variant_image: selectedVariant.variant_image,
      },
    })
  );

  navigate("/check-out?mode=single");
};


  const handleAdd = () => {
    if (!selectedVariant) return;

    const currentQty = qtyMap[selectedVariant.variantId] || 0;
    if (currentQty >= variantStock) return;

    setQtyMap((prev) => ({
      ...prev,
      [selectedVariant.variantId]: currentQty + 1,
    }));

    

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: selectedVariant.price || product.price,
        image1: selectedVariant.product_image || product.image1,
        selectedVariant: {
          variantId: selectedVariant.variantId,
          variant: selectedVariant.label || selectedVariant.variant,
          variant_image: selectedVariant.variant_image,
          product_image: selectedVariant.product_image || product.image1,
          price: selectedVariant.price || product.price,
          stock: selectedVariant.stock,
        },
      })
    );
  };

  const handleMinus = () => {
    if (!selectedVariant || qty <= 0) return;

    setQtyMap((prev) => {
      const copy = { ...prev };
      if (qty === 1) delete copy[selectedVariant.variantId];
      else copy[selectedVariant.variantId] = qty - 1;
      return copy;
    });

    dispatch({ type: "cart/decreaseQuantity", payload: selectedVariant.variantId });
  };

  const handleWishlistToggle = () => {
    if (!selectedVariant) return;

    if (inWishlist) {
      dispatch(removeFromWishlist({ id: product.id, selectedVariant }));
    } else {
      dispatch(addToWishlist({ ...product, selectedVariant }));
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(url);
    alert("Product link copied!");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-10 mt-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        {/* IMAGE SECTION */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-lg">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full rounded-2xl shadow-xl object-cover cursor-pointer hover:scale-105 transition-transform"
            />

            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/90 border rounded-full shadow hover:scale-110 transition"
              >
                <FiShare2 className="w-5 h-5 text-[#03619E]" />
              </button>

              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white/90 border rounded-full shadow hover:scale-110 transition"
              >
                {inWishlist ? (
                  <FaHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <FaRegHeart className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-5 overflow-x-auto">
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded-lg cursor-pointer ring-2 ${
                  mainImage === img ? "ring-[#03619E]" : "ring-transparent"
                } hover:ring-[#03619E]`}
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">{product.name}</h1>
          <p className="text-gray-400">{product.category_name} • {product.subcategory_name}</p>

          {selectedVariant && (
            <p className="text-sm text-gray-600">
              Selected Variant:{" "}
              <span className="font-semibold text-gray-800">{selectedVariant.label || selectedVariant.variant}</span>
            </p>
          )}

          <p className="text-3xl font-bold text-[#03619E] mt-2">
            ₹{parseFloat(selectedVariant?.price || product.price).toFixed(2)}
          </p>

          <div className="flex gap-3 flex-wrap mt-4">
            {product.variants?.map((v) => (
              <button
                key={v.variantId}
                onClick={() => handleVariantSelect(v)}
                className={`h-12 w-12 rounded-full border-2 overflow-hidden transition ${
                  selectedVariant?.variantId === v.variantId
                    ? "ring-2 ring-[#03619E]"
                    : "hover:ring-[#03619E]"
                }`}
              >
                <img src={v.variant_image || v.product_image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-4 items-center">
            {qty === 0 ? (
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-1 h-12 border rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-gray-100 transition ${
                  isOutOfStock ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            ) : (
              <div className="flex-1 h-12 border rounded-xl flex items-center justify-between px-4">
                <button onClick={handleMinus}>−</button>
                <span>{qty}</span>
                <button onClick={handleAdd}>+</button>
              </div>
            )}

           <button
  onClick={handleBuyNow}
  disabled={isOutOfStock}
  className={`flex-1 h-12 rounded-xl bg-[#03619E] text-white flex items-center justify-center gap-2 font-medium hover:bg-[#034a6f] transition ${
    isOutOfStock ? "cursor-not-allowed opacity-50" : ""
  }`}
>
  <FaBolt /> Buy Now
</button>

          </div>

          <p className={`text-sm font-medium ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
            {isOutOfStock ? "Out of Stock" : `${variantStock} available`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
