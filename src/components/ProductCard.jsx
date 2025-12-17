import { useEffect, useState } from "react";
import { FaShoppingCart, FaBolt, FaShareAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseQuantity } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, buyNow }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(product.image1);
  const [qtyMap, setQtyMap] = useState({});

  // Initialize first variant
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const first = product.variants[0];
      setSelectedVariant(first);
      setMainImage(first.product_image || product.image1);
    }
  }, [product]);

  // Map quantities from cart
  useEffect(() => {
    const map = {};
    cartItems.forEach(item => {
      const id = item.selectedVariant?.variantId || item.productId;
      map[id] = item.quantity;
    });
    setQtyMap(map);
  }, [cartItems]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setMainImage(variant.product_image || product.image1);
  };

  const handleAdd = () => {
    if (!selectedVariant) return;

    setQtyMap(prev => ({
      ...prev,
      [selectedVariant.variantId]: (prev[selectedVariant.variantId] || 0) + 1
    }));

    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image1: selectedVariant?.product_image || product.image1,
      selectedVariant: {
        variantId: selectedVariant?.variantId,
        variant: selectedVariant?.variant || selectedVariant?.label,
        variant_image: selectedVariant?.variant_image,
        product_image: selectedVariant?.product_image || product.image1,
        price: selectedVariant?.price || product.price,
      }
    }));
  };

  const handleMinus = () => {
    const currentQty = qtyMap[selectedVariant.variantId] || 0;
    if (currentQty <= 0) return;

    setQtyMap(prev => {
      const copy = { ...prev };
      if (currentQty === 1) delete copy[selectedVariant.variantId];
      else copy[selectedVariant.variantId] = currentQty - 1;
      return copy;
    });

    dispatch(decreaseQuantity(selectedVariant.variantId));
  };

  const qty = selectedVariant ? (qtyMap[selectedVariant.variantId] || 0) : 0;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url: shareUrl }); } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Product link copied");
    }
  };

  const handleImageClick = () => {
    navigate(`/product/${product.id}`, { state: { selectedVariantId: selectedVariant?.variantId || null } });
  };

  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 p-4 flex flex-col space-y-4 max-w-xs mx-auto">
      
      {/* MAIN IMAGE */}
      <div
        className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden bg-zinc-100 cursor-pointer"
        onClick={handleImageClick} // Only image click navigates
      >
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.stopPropagation(); handleShare(); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition"
        >
          <FaShareAlt size={13} />
        </button>
      </div>

      {/* DETAILS */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-zinc-900 truncate">{product.name}</h3>
        <p className="text-lg font-bold text-zinc-900">₹{selectedVariant?.price || product.price}</p>
        {selectedVariant && (
          <p className="text-xs text-zinc-500">{selectedVariant.label || selectedVariant.variant}</p>
        )}
      </div>

      {/* VARIANTS */}
      {product.variants?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {product.variants.map((variant) => (
            <button
              key={variant.variantId}
              onClick={() => handleVariantSelect(variant)} // Change variant without navigating
              className={`h-10 w-10 rounded-full overflow-hidden border-2 transition flex-shrink-0 ${selectedVariant?.variantId === variant.variantId ? "border-zinc-900" : "border-zinc-300 hover:border-zinc-500"}`}
            >
              <img
                src={variant.variant_image || variant.product_image || product.image1}
                alt={variant.variant}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 pt-2">
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="flex-1 h-10 text-sm font-medium flex items-center justify-center gap-2 rounded-lg border border-zinc-300 hover:bg-zinc-100 transition"
          >
            <FaShoppingCart size={14} /> Add to Cart
          </button>
        ) : (
          <div className="flex-1 h-10 flex items-center justify-between rounded-lg border border-zinc-300 px-3">
            <button onClick={handleMinus} className="text-lg leading-none">−</button>
            <span className="text-sm font-semibold">{qty}</span>
            <button onClick={handleAdd} className="text-lg leading-none">+</button>
          </div>
        )}

        <button
          onClick={() => buyNow({ ...product, variant: selectedVariant })}
          className="flex-1 h-10 text-sm font-medium flex items-center justify-center gap-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition"
        >
          <FaBolt size={14} /> Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
