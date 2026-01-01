import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    singleItem: null,      
    mode: "cart",          
  },

  reducers: {
    setSingleCheckoutItem: (state, action) => {
      state.singleItem = action.payload;
      state.mode = "single";
    },
    clearSingleCheckoutItem: (state) => {
      state.singleItem = null;
      state.mode = "cart";
    }
  },
});

export const { setSingleCheckoutItem, clearSingleCheckoutItem } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;
