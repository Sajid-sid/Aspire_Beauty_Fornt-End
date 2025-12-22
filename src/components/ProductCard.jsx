import { useEffect, useState } from "react";
import { FaShoppingCart, FaBolt, FaShareAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseQuantity } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product, buyNow }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { token, user } = useSelector((state) => state.user);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(product.image1);
  const [qtyMap, setQtyMap] = useState({});

  /* =========================
     WISHLIST
  ========================= */
  const isWishlisted = wishlistItems.some(
    (item) =>
      item.id === product.id &&
      item.selectedVariant?.variantId === selectedVariant?.variantId
  );

  const toggleWishlist = () => {
    if (!selectedVariant) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist({ id: product.id, selectedVariant }));
    } else {
      dispatch(addToWishlist({ ...product, selectedVariant }));
    }
  };

  /* =========================
     INIT FIRST VARIANT
  ========================= */
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const first = product.variants[0];
      setSelectedVariant(first);
      setMainImage(first.product_image || product.image1);
    }
  }, [product]);

  /* =========================
     MAP CART QTY PER VARIANT
  ========================= */
  useEffect(() => {
    const map = {};
    cartItems.forEach((item) => {
      const id = item.selectedVariant?.variantId;
      if (id) map[id] = item.quantity;
    });
    setQtyMap(map);
  }, [cartItems]);

  /* =========================
     HANDLERS
  ========================= */
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setMainImage(variant.product_image || product.image1);
  };

  const handleAdd = () => {
    if (!selectedVariant) return;

    const currentQty = qtyMap[selectedVariant.variantId] || 0;
    if (currentQty >= selectedVariant.stock) {
      alert("No more stock available for this variant");
      return;
    }

    setQtyMap((prev) => ({
      ...prev,
      [selectedVariant.variantId]: currentQty + 1,
    }));

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        image1: selectedVariant.product_image || product.image1,
        selectedVariant: {
          variantId: selectedVariant.variantId,
          variant: selectedVariant.variant,
          price: selectedVariant.price,
          stock: selectedVariant.stock,
          variant_image: selectedVariant.variant_image,
          product_image: selectedVariant.product_image || product.image1,
        },
      })
    );
  };

  const handleMinus = () => {
    if (!selectedVariant) return;

    const currentQty = qtyMap[selectedVariant.variantId] || 0;
    if (currentQty <= 0) return;

    setQtyMap((prev) => {
      const copy = { ...prev };
      if (currentQty === 1) delete copy[selectedVariant.variantId];
      else copy[selectedVariant.variantId] = currentQty - 1;
      return copy;
    });

    dispatch(decreaseQuantity(selectedVariant.variantId));
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Product link copied");
    }
  };

  const handleImageClick = () => {
    navigate(`/product/${product.id}`, {
      state: { selectedVariantId: selectedVariant?.variantId || null },
    });
  };

  const handleBuyNow = () => {
    if (!token || !user) {
      navigate("/user-login", {
        state: { redirectTo: `/product/${product.id}` },
      });
      return;
    }

    buyNow({
      productId: product.id,
      name: product.name,
      image:
        selectedVariant?.product_image ||
        selectedVariant?.variant_image ||
        product.image1,
      price: selectedVariant?.price,
      selectedVariant: {
        variantId: selectedVariant?.variantId,
        variant: selectedVariant?.variant,
        price: selectedVariant?.price,
        stock: selectedVariant?.stock,
        product_image:
          selectedVariant?.product_image ||
          selectedVariant?.variant_image ||
          product.image1,
        variant_image: selectedVariant?.variant_image,
      },
    });
  };

  /* =========================
     DERIVED VALUES
  ========================= */
  const qty = selectedVariant ? qtyMap[selectedVariant.variantId] || 0 : 0;
  const variantStock = selectedVariant?.stock ?? 0;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 p-4 flex flex-col space-y-4 max-w-xs mx-auto">

      {/* IMAGE */}
      <div
        className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden bg-zinc-100 cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow"
        >
          <FaShareAlt size={13} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist();
          }}
          className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow"
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500" size={14} />
          ) : (
            <FaRegHeart className="text-zinc-700" size={14} />
          )}
        </button>
      </div>

      {/* DETAILS */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold truncate">{product.name}</h3>
        <p className="text-lg font-bold">₹{selectedVariant?.price}</p>
        {selectedVariant && (
          <p className="text-xs text-zinc-500">
            Selected variant: <span>{selectedVariant.variant}</span>
          </p>
        )}
      </div>

      {/* VARIANTS */}
      {product.variants?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {product.variants.map((variant) => (
            <button
              key={variant.variantId}
              onClick={() => handleVariantSelect(variant)}
              className={`h-10 w-10 rounded-full overflow-hidden border-2
                ${
                  selectedVariant?.variantId === variant.variantId
                    ? "border-zinc-900"
                    : "border-zinc-300 hover:border-zinc-500"
                }`}
            >
              <img
                src={variant.variant_image || variant.product_image}
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
            disabled={variantStock === 0}
            className={`flex-1 h-10 text-sm font-medium
              flex items-center justify-center gap-2
              leading-none rounded-lg border
              ${
                variantStock === 0
                  ? "border-red-300 text-red-500 cursor-not-allowed bg-red-50"
                  : "border-zinc-300 hover:bg-zinc-100"
              }
            `}
          >
            <FaShoppingCart size={15} className="relative top-[1px]" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex-1 h-10 flex items-center justify-between rounded-lg border border-zinc-300 px-3">
            <button onClick={handleMinus} className="text-lg leading-none">−</button>
            <span className="text-sm font-semibold">{qty}</span>
            <button
              onClick={handleAdd}
              disabled={qty >= variantStock}
              className={`text-lg leading-none ${
                qty >= variantStock ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={handleBuyNow}
          disabled={variantStock === 0}
          className={`flex-1 h-10 text-sm font-medium
            flex items-center justify-center gap-2
            leading-none rounded-lg
            ${
              variantStock === 0
                ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }
          `}
        >
          <FaBolt size={15} className="relative top-[1px]" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
