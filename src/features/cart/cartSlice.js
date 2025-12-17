import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : { items: [], totalAmount: 0, totalItems: 0 };
  } catch (error) {
    console.error("Error loading cart:", error);
    return { items: [], totalAmount: 0, totalItems: 0 };
  }
};

// Save cart to localStorage
const saveCartToLocalStorage = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      // Use variant id to differentiate variants
      const variantId = product.selectedVariant?.variantId || product.id;

      const existing = state.items.find(
        (item) => (item.selectedVariant?.variantId || item.id) === variantId
      );

      if (existing) {
        existing.quantity += 1;
        state.items = [
          existing,
          ...state.items.filter(
            (item) => (item.selectedVariant?.variantId || item.id) !== variantId
          ),
        ];
      } else {
        state.items = [{ ...product, quantity: 1 }, ...state.items];
      }

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (sum, item) =>
          sum + item.quantity * (item.selectedVariant?.price || item.price),
        0
      );

      saveCartToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      const variantId = action.payload;
      state.items = state.items.filter(
        (item) => (item.selectedVariant?.variantId || item.id) !== variantId
      );

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (sum, item) =>
          sum + item.quantity * (item.selectedVariant?.price || item.price),
        0
      );

      saveCartToLocalStorage(state);
    },

    decreaseQuantity: (state, action) => {
      const variantId = action.payload;
      const existing = state.items.find(
        (item) => (item.selectedVariant?.variantId || item.id) === variantId
      );

      if (existing) {
        if (existing.quantity > 1) existing.quantity -= 1;
        else
          state.items = state.items.filter(
            (item) => (item.selectedVariant?.variantId || item.id) !== variantId
          );
      }

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (sum, item) =>
          sum + item.quantity * (item.selectedVariant?.price || item.price),
        0
      );

      saveCartToLocalStorage(state);
    },

    increaseQuantity: (state, action) => {
      const variantId = action.payload;
      const existing = state.items.find(
        (item) => (item.selectedVariant?.variantId || item.id) === variantId
      );

      if (existing) existing.quantity += 1;

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (sum, item) =>
          sum + item.quantity * (item.selectedVariant?.price || item.price),
        0
      );

      saveCartToLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      saveCartToLocalStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
