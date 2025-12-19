import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const { id, selectedVariant } = action.payload;
      const exists = state.items.some(
        (item) => item.id === id && item.selectedVariant?.variantId === selectedVariant?.variantId
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      const { id, selectedVariant } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.selectedVariant?.variantId === selectedVariant?.variantId)
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
