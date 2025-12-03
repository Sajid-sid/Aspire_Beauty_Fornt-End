import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api';

// === PLACE ORDER ===
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // { success: true, orderId: ... }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Order failed");
    }
  }
);

// === GET ORDER BY ID ===
export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order; // single order
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch order");
    }
  }
);

// === GET ALL ORDERS FOR USER ===
export const getUserOrders = createAsyncThunk(
  "orders/getUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      console.log(response.data.orders);
      return response.data.orders; // array of orders
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);


const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],          // all orders for user
    currentOrder: null,  // single order view
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearUserOrders: (state) => {
      state.userOrders = [];
    },
  },
  extraReducers: (builder) => {
    // === PLACE ORDER ===
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
      });
       
      //get single order
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // === GET ALL USER ORDERS ===
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearUserOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
