import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";



// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async () => {
    const res = await api.get("/products");
    console.log(res.data.products);
    return res.data.products || [];
  }
);

// Fetch single product
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    const res = await api.get(`/products/${id}`);
    console.log(res.data);
    return res.data;
  }
);



const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    // ===== PRODUCT REALTIME =====
    addProductRealtime: (state, action) => {
      const exists = state.products.find(p => p.id === action.payload.id);
      if (!exists) {
        state.products.unshift(action.payload);
      }
    },

    updateProductRealtime: (state, action) => {
      const index = state.products.findIndex(
        (p) => p.id === action.payload.id
      );

      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...action.payload,
        };
      }

      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct = {
          ...state.selectedProduct,
          ...action.payload,
        };
      }
    },

    deleteProductRealtime: (state, action) => {
      state.products = state.products.filter(
        p => p.id !== action.payload
      );

      if (state.selectedProduct?.id === action.payload) {
        state.selectedProduct = null;
      }
    },

    // ===== VARIANT REALTIME =====
  


updateVariantRealtime: (state, action) => {
  const { productId, variant } = action.payload;

  const product = state.products.find(p => p.id === productId);
  if (!product?.variants) return;

  const idx = product.variants.findIndex(
    v => v.variantId === variant.variantId
  );

  if (idx !== -1) {
    product.variants[idx] = {
      ...product.variants[idx],
      ...variant,
    };
  }

  //  recalc price
  const prices = product.variants.map(v => Number(v.price));
  product.price = Math.min(...prices);
},


addVariantRealtime: (state, action) => {
  let { productId, variant } = action.payload;

  productId = Number(productId); 

  const product = state.products.find(p => Number(p.id) === productId);
  if (!product) return;

  if (!product.variants) product.variants = [];

  const exists = product.variants.some(
    v => v.variantId === variant.variantId
  );

  if (!exists) {
    product.variants.push({
      ...variant,
      price: Number(variant.price),
      stock: Number(variant.stock),
    });
  }

  product.lastAddedVariantId = variant.variantId;


  product.price = Math.min(
    ...product.variants.map(v => Number(v.price))
  );
},

deleteVariantRealtime: (state, action) => {
  let { productId, variantId } = action.payload;

  productId = Number(productId);
  variantId = Number(variantId);

  const product = state.products.find(
    p => Number(p.id) === productId
  );
  if (!product?.variants) return;

  console.log(
    "DELETE BEFORE",
    product.variants.map(v => v.variantId),
    "remove",
    variantId
  );

  product.variants = product.variants.filter(
    v => Number(v.variantId) !== variantId
  );

  console.log(
    "DELETE AFTER",
    product.variants.map(v => v.variantId)
  );

  //  recalc price
  if (product.variants.length > 0) {
    product.price = Math.min(
      ...product.variants.map(v => Number(v.price))
    );
  } else {
    product.price = 0;
  }
},








  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (state.products.length === 0) {
          state.products = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export const {
  clearSelectedProduct,
  addProductRealtime,
  updateProductRealtime,
  deleteProductRealtime,
  addVariantRealtime,
  updateVariantRealtime,
  deleteVariantRealtime,
} = productSlice.actions;

export default productSlice.reducer;
