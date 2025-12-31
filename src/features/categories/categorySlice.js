import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

//  Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const res = await api.get("/categories"); 
    return res.data; 
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
