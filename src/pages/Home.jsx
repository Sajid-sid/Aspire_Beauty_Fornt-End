import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCategories } from "../features/categories/categorySlice";
import { fetchSubcategories } from "../features/subcategories/subcategorySlice";
import { fetchProducts } from "../features/products/productSlice";
import { fetchBanner } from "../features/banner/bannerSlice";

import {
  setCategory,
  setSubcategory,
  clearFilters,
} from "../features/filters/filterSlice";

import { addToCart } from "../features/cart/cartSlice";

import ProductCard from "../components/ProductCard";
import ScrollContainer from "../components/ScrollContainer";
import { setSingleCheckoutItem } from "../features/checkout/checkoutSlice";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: categories, loading: categoryLoading } = useSelector(
    (state) => state.categories
  );

  const { items: subcategories, loading: subcategoryLoading } = useSelector(
    (state) => state.subcategories
  );

  const { items: products, loading: productLoading } = useSelector(
    (state) => state.products
  );

  const { data: banner } = useSelector((state) => state.banner);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchBanner());
    dispatch(fetchCategories());
    dispatch(fetchSubcategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ================= BANNERS ================= */
  const desktopSlides = [
    { image: banner?.home1, link: "/products" },
    { image: banner?.home2, link: "/products" },
    { image: banner?.home3, link: "/products" },
  ];

  const mobileSlides = [
    { image: banner?.mobile1, link: "/products" },
    { image: banner?.mobile2, link: "/products" },
    { image: banner?.mobile3, link: "/products" },
  ];

  useEffect(() => {
    if (!desktopSlides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % desktopSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [desktopSlides.length]);

  /* ================= PRODUCT LIST ================= */
  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  /* ================= HANDLERS ================= */
  const handleCategoryClick = (name) => {
    dispatch(clearFilters());
    dispatch(setCategory(name));
    navigate("/products");
  };

  const handleSubcategoryClick = (name) => {
    dispatch(clearFilters());
    dispatch(setSubcategory(name));
    navigate("/products");
  };

  const handleAddToCart = (cartItem) => {
    dispatch(addToCart(cartItem));
  };

   const handleBuyNow = (product) => {
      dispatch(setSingleCheckoutItem({ ...product, quantity: 1 }));
      navigate("/check-out?mode=single");
    };

  return (
    <div className="min-h-screen bg-white">
      {/* ================= DESKTOP BANNER ================= */}
      <div className="hidden md:block relative overflow-hidden">
        <a href={desktopSlides[currentSlide]?.link}>
          <img
            src={desktopSlides[currentSlide]?.image}
            alt="Banner"
            className="w-full object-cover transition-all duration-700"
          />
        </a>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {desktopSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentSlide ? "bg-[#FF5757]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= MOBILE BANNER ================= */}
      <div className="md:hidden relative overflow-hidden">
        <a href={mobileSlides[currentSlide]?.link}>
          <img
            src={mobileSlides[currentSlide]?.image}
            alt="Mobile Banner"
            className="w-full object-cover transition-all duration-700"
          />
        </a>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {mobileSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full ${
                idx === currentSlide ? "bg-[#FF5757]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="flex flex-col items-center mt-16 mb-20 px-4">
        <h2 className="text-3xl font-bold mb-10 text-[#001B3D]">
          Shop by Category
        </h2>

        {categoryLoading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <ScrollContainer>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center cursor-pointer flex-shrink-0 min-w-[110px] sm:min-w-[140px]"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gray-100 shadow-md hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-transparent hover:border-[#FF5757]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <p className="mt-3 font-semibold text-[#001B3D] text-sm sm:text-base">
                  {cat.name}
                </p>
              </div>
            ))}
          </ScrollContainer>
        )}
      </section>

      {/* ================= SUBCATEGORIES ================= */}
      <section className="flex flex-col items-center mt-16 mb-20 px-4">
        <h2 className="text-3xl font-bold mb-10 text-[#001B3D]">
          Shop by Subcategory
        </h2>

        {subcategoryLoading ? (
          <p>Loading subcategories...</p>
        ) : subcategories.length === 0 ? (
          <p>No subcategories found.</p>
        ) : (
          <ScrollContainer>
            {subcategories.map((sub) => (
              <div
                key={sub.id}
                onClick={() => handleSubcategoryClick(sub.name)}
                className="cursor-pointer bg-white rounded-full shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-5 text-center min-w-[150px] border border-gray-200 hover:border-[#FF5757]"
              >
                <h3 className="font-semibold text-[#001B3D]">{sub.name}</h3>
              </div>
            ))}
          </ScrollContainer>
        )}
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="flex flex-col items-center mt-8 mb-16 px-4">
        <h2 className="text-3xl font-bold mb-10 text-[#001B3D]">
          Featured Products
        </h2>

        {productLoading ? (
          <p>Loading products...</p>
        ) : productList.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productList.slice(0, 12).map((product) => (
              <div
                key={product.id || product._id}
                className="flex justify-center"
              >
                <ProductCard
                  product={product}
                  addToCart={handleAddToCart}
                  buyNow={handleBuyNow}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
