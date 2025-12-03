import { configureStore, createSlice } from "@reduxjs/toolkit";
import categoryReducer from "../features/categories/categorySlice";
import wishlistReducer from '../features/wishlist/wishlistSlice';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice'
import searchReducer from '../features/search/searchSlice'
import subcategoryReducer from "../features/subcategories/subcategorySlice";
import filterReducer from '../features/filters/filterSlice';
import bannerReducer from '../features/banner/bannerSlice';
import checkoutReducer from '../features/checkout/checkoutSlice'
import ordersReducer from '../features/orders/ordersSlice'
import productReducer from "../features/products/productSlice";


export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    user: userReducer,
     subcategories: subcategoryReducer,
    search: searchReducer,
    filters: filterReducer,
    banner: bannerReducer,
     checkout: checkoutReducer,
     orders: ordersReducer,
  },
});



export default store;
