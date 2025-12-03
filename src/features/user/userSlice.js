// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import axios from "axios";

// load saved user & token (if any)
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

// ---------------------- Async Thunks ----------------------

// Register
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/users/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    } catch (err) {
      console.error("Register API Error:", err.response || err);
      return rejectWithValue(err.response?.data?.message || "Signup failed.");
    }
  }
);


// Login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/login", { email, password });
      // persist
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data; // expecting { message, token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed.");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
});

// Forgot Password (sends reset link)
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/forgot-password", { email });
      return res.data; // { message: "Password reset link sent..." }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset link."
      );
    }
  }
);

// Reset Password (frontend sends token + new passwords)
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
      return res.data; // { message: "Password reset successfully!" }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password."
      );
    }
  }
);

// ---------------------- Slice ----------------------
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    loading: false,
    error: null,
    message: "",
  },
  reducers: {
    // small helper to clear messages / errors from UI
    clearMessage(state) {
      state.message = "";
      state.error = null;
    },

     updateUser(state, action) {
      // merge updated fields into user
      state.user = { ...state.user, ...action.payload };

      // update localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
    },

  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Registered successfully.";

        // Update user & token in state
        state.user = action.payload.user;
        state.token = action.payload.token;

        // Persist in localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed.";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message || "Login successful.";

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.message = "";
        state.error = null;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Reset link sent.";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send reset link.";
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Password reset successfully.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password.";
      });
  },
});

export const { clearMessage, updateUser } = userSlice.actions;
export default userSlice.reducer;
