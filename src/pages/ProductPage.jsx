import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { setSingleCheckoutItem } from "../features/checkout/checkoutSlice";
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const products = useSelector((state) => state.products.items);
  const products = useSelector((state) => state.products.products);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const product = products.find((p) => String(p.id) === String(id));

  console.log(product);

  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qtyMap, setQtyMap] = useState({});
  const [galleryImages, setGalleryImages] = useState([]);

  //  Carousel states
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

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
        image: selectedVariant.product_image || product.image1,
        price: selectedVariant.price || product.price,
        selectedVariant: {
          variantId: selectedVariant.variantId,
          variant: selectedVariant.label || selectedVariant.variant,
          price: selectedVariant.price || product.price,
          stock: selectedVariant.stock,
          product_image: selectedVariant.product_image || product.image1,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* IMAGE SECTION */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-lg">
            <img
              src={mainImage}
              alt={product.name}
              onClick={() => {
                setCarouselIndex(galleryImages.indexOf(mainImage));
                setShowCarousel(true);
              }}
              className="w-full rounded-2xl shadow-xl object-cover cursor-pointer hover:scale-105 transition"
            />

            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={handleShare} className="p-2 bg-white/90 rounded-full shadow">
                <FiShare2 className="w-5 h-5 text-[#03619E]" />
              </button>
              <button onClick={handleWishlistToggle} className="p-2 bg-white/90 rounded-full shadow">
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
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded-lg cursor-pointer ring-2 ${mainImage === img ? "ring-[#03619E]" : "ring-transparent"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold">{product.name}</h1>
          <p className="text-gray-400">
            Category : {product.category_name} • {product.subcategory_name}
          </p>

          <p className="text-3xl font-bold text-[#03619E]">
            ₹{parseFloat(selectedVariant?.price || product.price).toFixed(2)}
          </p>

          <div className="flex gap-3 flex-wrap">
            {product.variants?.map((v) => (
              <button
                key={v.variantId}
                onClick={() => handleVariantSelect(v)}
                className={`h-12 w-12 rounded-full border overflow-hidden ${selectedVariant?.variantId === v.variantId ? "ring-2 ring-[#03619E]" : ""
                  }`}
              >
                <img src={v.variant_image || v.product_image} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            {qty === 0 ? (
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="flex-1 h-12 border rounded-xl flex items-center justify-center gap-2"
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
              className="flex-1 h-12 rounded-xl bg-[#03619E] text-white flex items-center justify-center gap-2"
            >
              <FaBolt /> Buy Now
            </button>
          </div>

{/* DELIVERY & POLICY INFO */}
<div className="mt-6 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm space-y-4">

  {/* STOCK */}
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
          ${isOutOfStock
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-700"
          }`}
      >
        ● {isOutOfStock ? "Out of Stock" : "In Stock"}
      </span>

      {!isOutOfStock && (
        <span className="text-xs text-zinc-500">
          ({variantStock} available)
        </span>
      )}
    </div>
  </div>

  {/* DIVIDER */}
  <div className="h-px bg-zinc-200" />

  {/* DELIVERY */}
  <div className="flex items-center gap-3 text-sm text-zinc-700">
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      🚚
    </span>
    <span>
      Delivery within <b className="text-zinc-900">7 days</b>
    </span>
  </div>

  {/* COD */}
  <div className="flex items-center gap-3 text-sm text-zinc-700">
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
      💰
    </span>
    <span>
      <b className="text-zinc-900">Cash on Delivery</b> available
    </span>
  </div>

  {/* RETURN */}
  <div className="flex items-center gap-3 text-sm text-zinc-700">
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
      🔄
    </span>
    <span>
      <b className="text-zinc-900">Easy Return & Refund</b> policy
    </span>
  </div>

</div>


        </div>
      </div>

      {/*  IMAGE CAROUSEL MODAL */}
      {showCarousel && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setShowCarousel(false)}
            className="absolute top-5 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <button
            onClick={() =>
              setCarouselIndex(
                carouselIndex === 0 ? galleryImages.length - 1 : carouselIndex - 1
              )
            }
            className="absolute left-5 text-white text-4xl"
          >
            ‹
          </button>

          <img
            src={galleryImages[carouselIndex]}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
          />

          <button
            onClick={() =>
              setCarouselIndex(
                carouselIndex === galleryImages.length - 1 ? 0 : carouselIndex + 1
              )
            }
            className="absolute right-5 text-white text-4xl"
          >
            ›
          </button>
        </div>
      )}
      {/* PRODUCT DETAILS */}
<div className="mt-16 space-y-10">

  {/* DESCRIPTION IMAGE */}
  {product.description_image && (
    <div className="w-full">
      <img
        src={product.description_image}
        alt="Product description"
        className="w-full max-h-[500px] object-cover rounded-2xl shadow"
      />
    </div>
  )}

  {/* DESCRIPTION */}
  {product.description && (
    <section>
      <h2 className="text-2xl font-bold mb-3">Description</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {product.description}
      </p>
    </section>
  )}

  {/* FEATURES */}
  {product.features && (
    <section>
      <h2 className="text-2xl font-bold mb-3">Key Features</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 whitespace-pre-line">
        {product.features.split("\r\n").map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
    </section>
  )}

  {/* HOW TO USE */}
  {product.how_to_use && (
    <section>
      <h2 className="text-2xl font-bold mb-3">How to Use</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {product.how_to_use}
      </p>
    </section>
  )}

  {/* INGREDIENTS */}
  {product.ingredients && (
    <section>
      <h2 className="text-2xl font-bold mb-3">Ingredients</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {product.ingredients}
      </p>
    </section>
  )}

  {/* MANUFACTURER */}
  {product.manufacturer_importer && (
    <section>
      <h2 className="text-2xl font-bold mb-3">Manufacturer / Importer</h2>
      <p className="text-gray-700">
        {product.manufacturer_importer}
      </p>
    </section>
  )}

</div>

    </div>
  );
};

export default ProductPage;
