import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    category: "",
    subcategory: "",
    priceRange: "",
    sort: "",
    searchTerm: "",
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.subcategory = ""; // reset subcategory on new category
    },
    setSubcategory: (state, action) => {
      state.subcategory = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearFilters: (state) => {
      state.category = "";
      state.subcategory = "";
      state.priceRange = "";
      state.sort = "";
      state.searchTerm = "";
    },
    resetAll: (state) => {
      state.category = "";
      state.subcategory = "";
      state.priceRange = "";
      state.sort = "";
      state.searchTerm = "";
    },
  },
});

export const {
  setCategory,
  setSubcategory,
  setPriceRange,
  setSort,
  setSearchTerm,
  clearFilters,
  resetAll,
} = filterSlice.actions;

export default filterSlice.reducer;
