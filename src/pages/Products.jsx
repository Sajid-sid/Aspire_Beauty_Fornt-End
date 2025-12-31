import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

import {
  setCategory,
  setSubcategory,
  setSort,
  setPriceRange,
  clearFilters,
} from "../features/filters/filterSlice";
import { fetchProducts } from "../features/products/productSlice";
import { addToCart as addToCartAction } from "../features/cart/cartSlice";
import { setSingleCheckoutItem } from "../features/checkout/checkoutSlice";

import ProductCard from "../components/ProductCard";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const { products = [], loading } = useSelector(
  (state) => state.products
);

  const { category, subcategory, priceRange, sort, searchTerm } = useSelector(
    (state) => state.filters
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ---------- OPTIONS ---------- */
  const categoryOptions = [...new Set(products.map((p) => p.category_name))];

  const subcategoryOptions = category
    ? [
        ...new Set(
          products
            .filter(
              (p) =>
                p.category_name?.toLowerCase() === category.toLowerCase()
            )
            .map((p) => p.subcategory_name)
        ),
      ]
    : [...new Set(products.map((p) => p.subcategory_name))];

  /* ---------- FILTER PRODUCTS ---------- */
  const finalProducts = products
    .filter((p) =>
      category ? p.category_name?.toLowerCase() === category.toLowerCase() : true
    )
    .filter((p) =>
      subcategory
        ? p.subcategory_name?.toLowerCase() === subcategory.toLowerCase()
        : true
    )
    .filter((p) => {
      const price = Number(p.price);
      if (!priceRange) return true;
      if (priceRange === "0-500") return price <= 500;
      if (priceRange === "500-1000") return price > 500 && price <= 1000;
      if (priceRange === "1000-2000") return price > 1000 && price <= 2000;
      if (priceRange === "2000+") return price > 2000;
      return true;
    })
    .filter((p) =>
      searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      if (sort === "lowhigh") return a.price - b.price;
      if (sort === "highlow") return b.price - a.price;
      return 0;
    });

  /* ---------- FILTER CHIP COMPONENT ---------- */
  const FilterChip = ({ label, value, onChange, options }) => (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-4 py-2 pr-8 rounded-full border border-gray-300 bg-white text-sm font-medium"
      >
        <option value="">{label}</option>
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === "object" ? opt.value : opt}>
            {typeof opt === "object" ? opt.label : opt}
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none" />
    </div>
  );

  /* ---------- ADD TO CART / BUY NOW ---------- */
  const handleAddToCart = (product) => {
    dispatch(addToCartAction(product));
  };

  const handleBuyNow = (product) => {
    dispatch(setSingleCheckoutItem({ ...product, quantity: 1 }));
    navigate("/check-out?mode=single");
  };

  return (
    <div className="min-h-screen">

      {/* ================= MOBILE FILTER BAR ================= */}
      <div className="sm:hidden sticky top-[64px] z-30 bg-white border-b">
        <div className="flex gap-3 px-3 py-3 overflow-x-auto no-scrollbar">
          <FilterChip
            label="Category"
            value={category}
            onChange={(v) => dispatch(setCategory(v))}
            options={categoryOptions}
          />
          <FilterChip
            label="Subcategory"
            value={subcategory}
            onChange={(v) => dispatch(setSubcategory(v))}
            options={subcategoryOptions}
          />
          <FilterChip
            label="Price"
            value={priceRange}
            onChange={(v) => dispatch(setPriceRange(v))}
            options={[
              { value: "0-500", label: "₹0 - ₹500" },
              { value: "500-1000", label: "₹500 - ₹1000" },
              { value: "1000-2000", label: "₹1000 - ₹2000" },
              { value: "2000+", label: "₹2000+" },
            ]}
          />
          <FilterChip
            label="Sort"
            value={sort}
            onChange={(v) => dispatch(setSort(v))}
            options={[
              { value: "az", label: "A → Z" },
              { value: "za", label: "Z → A" },
              { value: "lowhigh", label: "Low → High" },
              { value: "highlow", label: "High → Low" },
            ]}
          />
          <button
            onClick={() => dispatch(clearFilters())}
            className="px-4 py-2 rounded-full border border-red-400 text-red-500 text-sm shrink-0"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ================= DESKTOP FILTERS ================= */}
      <div className="hidden sm:flex gap-3 justify-center items-center pt-6 px-4">
        <FilterChip
          label="All Categories"
          value={category}
          onChange={(v) => dispatch(setCategory(v))}
          options={categoryOptions}
        />
        <FilterChip
          label="All Subcategories"
          value={subcategory}
          onChange={(v) => dispatch(setSubcategory(v))}
          options={subcategoryOptions}
        />
        <FilterChip
          label="All Prices"
          value={priceRange}
          onChange={(v) => dispatch(setPriceRange(v))}
          options={[
            { value: "0-500", label: "₹0 - ₹500" },
            { value: "500-1000", label: "₹500 - ₹1000" },
            { value: "1000-2000", label: "₹1000 - ₹2000" },
            { value: "2000+", label: "₹2000+" },
          ]}
        />
        <FilterChip
          label="Sort"
          value={sort}
          onChange={(v) => dispatch(setSort(v))}
          options={[
            { value: "az", label: "A → Z" },
            { value: "za", label: "Z → A" },
            { value: "lowhigh", label: "Low → High" },
            { value: "highlow", label: "High → Low" },
          ]}
        />
        <button
          onClick={() => dispatch(clearFilters())}
          className="px-4 py-2 rounded-full border border-red-500 text-red-500"
        >
          Clear
        </button>
      </div>

      {/* ================= PRODUCTS GRID ================= */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <p className="col-span-full text-center">Loading products...</p>
        ) : finalProducts.length ? (
          finalProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              addToCart={handleAddToCart}
              buyNow={handleBuyNow}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No Products Found
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
