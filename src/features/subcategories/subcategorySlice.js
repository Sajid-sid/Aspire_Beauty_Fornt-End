// src/features/subcategories/subcategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchSubcategories = createAsyncThunk(
  "subcategories/fetchAll",
  async () => {
    const res = await api.get("/subcategories");
    return res.data;
  }
);

const subcategorySlice = createSlice({
  name: "subcategories",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default subcategorySlice.reducer;
