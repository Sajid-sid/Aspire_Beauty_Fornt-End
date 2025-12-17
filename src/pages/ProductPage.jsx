import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.items || []);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const product = products.find((p) => p.id === parseInt(id));

  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qtyMap, setQtyMap] = useState({});
  const [galleryImages, setGalleryImages] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  // Zoom overlay
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const zoomRef = useRef();

  useEffect(() => {
    if (!product) return;

    const firstVariant = product.variants?.[0] || null;
    setSelectedVariant(firstVariant);

    const variantImage = firstVariant?.product_image;
    const images = [
      variantImage,
      ...[product.image1, product.image2, product.image3, product.image4].filter(Boolean),
    ];

    setGalleryImages(images);
    setMainImage(variantImage || product.image1 || "");

    const map = {};
    cartItems.forEach((item) => {
      const vid = item.selectedVariant?.variantId || item.productId;
      map[vid] = item.quantity;
    });
    setQtyMap(map);
  }, [product, cartItems]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-80 text-gray-500 text-lg">
        Product not found
      </div>
    );
  }

  const variantStock = selectedVariant?.stock || product.total_stock || 0;
  const isOutOfStock = variantStock <= 0;
  const inWishlist = wishlistItems.some((item) => item.id === product.id);
  const qty = selectedVariant ? qtyMap[selectedVariant.variantId] || 0 : 0;

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    const images = [
      variant.product_image,
      ...[product.image1, product.image2, product.image3, product.image4].filter(Boolean),
    ];
    setGalleryImages(images);
    setMainImage(variant.product_image || product.image1 || "");
  };

  const handleAdd = () => {
    if (!selectedVariant) return;

    setQtyMap((prev) => ({
      ...prev,
      [selectedVariant.variantId]: (prev[selectedVariant.variantId] || 0) + 1,
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

  const handleWishlistToggle = () => dispatch(toggleWishlist(product));

  const handleShare = () => {
    const url = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(url);
    alert("Product link copied!");
  };

  const toggleSection = (index) => setOpenIndex(openIndex === index ? null : index);

  const openZoom = (index) => {
    setZoomIndex(index);
    setZoomScale(1);
    setIsZoomOpen(true);
  };

  const nextZoom = () => setZoomIndex((prev) => (prev + 1) % galleryImages.length);
  const prevZoom = () =>
    setZoomIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  // Touch handlers for swipe & pinch
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStart({ dist, scale: zoomScale });
    }
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    if (e.touches.length === 2) {
      // pinch zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = (dist / touchStart.dist) * touchStart.scale;
      setZoomScale(Math.min(Math.max(scale, 1), 3));
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    if (touchStart.x !== undefined && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStart.x;
      if (dx > 50) prevZoom();
      else if (dx < -50) nextZoom();
    }
    setTouchStart(null);
  };

  const detailsSections = [
    {
      title: "Description",
      content: (
        <div className="space-y-4">
          {product.description_image && (
            <img
              src={product.description_image}
              alt="Description"
              className="mx-auto rounded-2xl shadow-lg"
            />
          )}
          <p className="text-gray-700">{product.description || "N/A"}</p>
        </div>
      ),
    },
    { title: "How To Use", content: product.how_to_use || "N/A" },
    { title: "Ingredients", content: product.ingredients || "N/A" },
    { title: "Additional Details", content: product.features || "N/A" },
    { title: "Manufacturer & Importer", content: product.manufacturer_importer || "N/A" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* IMAGE SECTION */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-lg">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full rounded-2xl shadow-xl object-cover cursor-zoom-in"
              onClick={() => openZoom(galleryImages.indexOf(mainImage))}
            />

            {/* SHARE + WISHLIST */}
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

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-5 overflow-x-auto">
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                onClick={() => {
                  setMainImage(img);
                  openZoom(idx);
                }}
                className={`w-20 h-20 rounded-lg cursor-pointer ring-2 ${
                  mainImage === img ? "ring-[#03619E]" : "ring-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div>
          <h1 className="text-5xl font-extrabold mb-2">{product.name}</h1>

          <p className="text-gray-400 mb-1">
            {product.category_name} • {product.subcategory_name}
          </p>

          {selectedVariant && (
            <p className="text-sm text-gray-600 mb-2">
              Selected Variant:
              <span className="ml-1 font-semibold text-gray-800">
                {selectedVariant.label || selectedVariant.variant}
              </span>
            </p>
          )}

          <p className="text-3xl font-bold text-[#03619E] mb-6">
            ₹{parseFloat(selectedVariant?.price || product.price).toFixed(2)}
          </p>

          {/* VARIANTS */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {product.variants?.map((v) => (
              <button
                key={v.variantId}
                onClick={() => handleVariantSelect(v)}
                className={`h-12 w-12 rounded-full border-2 overflow-hidden ${
                  selectedVariant?.variantId === v.variantId
                    ? "ring-2 ring-[#03619E]"
                    : ""
                }`}
              >
                <img
                  src={v.variant_image || v.product_image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* CART */}
          <div className="flex gap-3 mb-4">
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
              disabled={isOutOfStock}
              className="flex-1 h-12 rounded-xl bg-[#03619E] text-white flex items-center justify-center gap-2"
            >
              <FaBolt /> Buy Now
            </button>
          </div>

          <p className="text-sm">
            Stock:{" "}
            <span className={isOutOfStock ? "text-red-500" : "text-green-600"}>
              {isOutOfStock ? "Out of Stock" : `${variantStock} available`}
            </span>
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-12 max-w-5xl mx-auto space-y-4">
        {detailsSections.map((section, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 flex justify-between items-center font-semibold text-gray-800 text-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <span>{section.title}</span>
              <span
                className={`text-2xl font-bold transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-45" : "rotate-0"
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                openIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 text-gray-700 text-base">{section.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ZOOM CAROUSEL */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold"
          >
            &times;
          </button>

          <button
            onClick={prevZoom}
            className="absolute left-5 text-white text-4xl font-bold"
          >
            ‹
          </button>

          <div className="max-w-3xl max-h-[90vh] flex items-center justify-center overflow-hidden">
            <img
              ref={zoomRef}
              src={galleryImages[zoomIndex]}
              alt=""
              className="object-contain"
              style={{ transform: `scale(${zoomScale})` }}
              draggable={false}
            />
          </div>

          <button
            onClick={nextZoom}
            className="absolute right-5 text-white text-4xl font-bold"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
