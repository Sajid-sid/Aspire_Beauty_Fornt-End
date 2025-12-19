import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const buyNow = (payload) => {
    console.log("BUY NOW FROM WISHLIST", payload);
    // navigate to checkout if needed
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-zinc-400">
        <p className="text-lg font-medium">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <ProductCard
            key={`${item.id}-${item.selectedVariant?.variantId}`}
            product={{
              ...item,
              // 🔥 ensure variants exist (important)
              variants: item.variants?.length
                ? item.variants
                : item.selectedVariant
                ? [item.selectedVariant]
                : [],
            }}
            buyNow={buyNow}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
