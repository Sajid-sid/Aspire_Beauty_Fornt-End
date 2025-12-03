import { createSlice } from "@reduxjs/toolkit";

// ✅ Load from localStorage if available
const loadCartFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : { items: [], totalAmount: 0 };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { items: [], totalAmount: 0 };
  }
};

// ✅ Save to localStorage
const saveCartToLocalStorage = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
   addToCart: (state, action) => {
  const product = action.payload;
  const existing = state.items.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;

    // 🧠 Move the updated item to the top
    state.items = [
      existing,
      ...state.items.filter((item) => item.id !== product.id),
    ];
  } else {
    // 🧠 Add new item to top instead of bottom
    state.items = [{ ...product, quantity: 1 }, ...state.items];
  }

  state.totalItems = state.items.reduce(
    (number, item) => number + item.quantity,
    0
  );

  state.totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  saveCartToLocalStorage(state);
},


    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);

      state.totalItems = state.items.reduce(
    (number, item) => number + item.quantity,
    0
  );

      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCartToLocalStorage(state);
    },



    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const existing = state.items.find((item) => item.id === productId);

      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter((item) => item.id !== productId);
      }

      state.totalItems = state.items.reduce(
    (number, item) => number + item.quantity,
    0
  );

      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCartToLocalStorage(state);
    },

    // ✅ ADD THIS NEW ACTION
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const existing = state.items.find((item) => item.id === productId);

      if (existing) {
        existing.quantity += 1;
      }

      state.totalItems = state.items.reduce(
    (number, item) => number + item.quantity,
    0
  );

      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
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
