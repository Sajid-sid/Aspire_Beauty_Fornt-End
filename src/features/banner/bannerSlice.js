// src/features/banner/bannerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from '../../api';



// -------------------- GET BANNER --------------------
export const fetchBanner = createAsyncThunk(
  "banner/fetchBanner",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/banner');
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load banner");
    }
  }
);

// -------------------- UPDATE BANNER --------------------
export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.put('banner/update', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update banner");
    }
  }
);

// -------------------- SLICE --------------------
const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    data: {},         // <-- always exists
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || {};
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
