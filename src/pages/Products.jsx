import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCategory,  setSubcategory,  setSort, setPriceRange, clearFilters, } from "../features/filters/filterSlice";
import ProductCard from "../components/ProductCard";
import api from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false); 

  const dispatch = useDispatch();
  const { category, subcategory, priceRange, sort, searchTerm } = useSelector(
    (state) => state.filters
  );

  // Fetch products once
  useEffect(() => {
    api.get("/products").then((res) => {
     
      setProducts(res.data || []);
    });
  }, []);

  // Unique categories
  const categoryOptions = [...new Set(products.map((p) => p.category_name))];

  // Unique subcategories based on selected category
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

  // Final filtered products
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

  // Reusable dropdown
  const Dropdown = ({ value, onChange, options }) => (
    <div className="relative">
      <select
        className="appearance-none bg-white px-5 py-2.5 rounded-xl border border-[#001b3d] shadow-sm text-[#001b3d] font-medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === "object" ? opt.value : opt}>
            {typeof opt === "object" ? opt.label : opt}
          </option>
        ))}
      </select>

      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#001b3d] text-xs" />
    </div>
  );

  return (
    <div className="min-h-screen">

      {/* MOBILE FILTER BUTTON */}
      <div className="sm:hidden px-4 pt-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full py-3 bg-[#001b3d] text-white rounded-xl shadow"
        >
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* MOBILE FILTERS PANEL */}
      {showMobileFilters && (
        <div className="sm:hidden flex flex-col gap-3 px-4 py-4">
          <Dropdown
            value={category}
            onChange={(val) => dispatch(setCategory(val))}
            options={[
              { value: "", label: "All Categories" },
              ...categoryOptions.map((c) => ({ value: c, label: c })),
            ]}
          />

          <Dropdown
            value={subcategory}
            onChange={(val) => dispatch(setSubcategory(val))}
            options={[
              { value: "", label: "All Subcategories" },
              ...subcategoryOptions.map((s) => ({ value: s, label: s })),
            ]}
          />

          <Dropdown
            value={priceRange}
            onChange={(val) => dispatch(setPriceRange(val))}
            options={[
              { value: "", label: "All Prices" },
              { value: "0-500", label: "₹0 - ₹500" },
              { value: "500-1000", label: "₹500 - ₹1000" },
              { value: "1000-2000", label: "₹1000 - ₹2000" },
              { value: "2000+", label: "₹2000+" },
            ]}
          />

          <Dropdown
            value={sort}
            onChange={(val) => dispatch(setSort(val))}
            options={[
              { value: "", label: "Sort" },
              { value: "az", label: "A → Z" },
              { value: "za", label: "Z → A" },
              { value: "lowhigh", label: "Low → High" },
              { value: "highlow", label: "High → Low" },
            ]}
          />

          <button
            onClick={() => dispatch(clearFilters())}
            className="px-4 py-2 rounded-full border border-[#ff5757] text-[#ff5757] hover:bg-[#ff5757] hover:text-white transition"
          >
            Clear
          </button>
        </div>
      )}

      {/* DESKTOP FILTERS */}
      <div className="hidden sm:flex gap-3 justify-center items-center pt-4">
        <Dropdown
          value={category}
          onChange={(val) => dispatch(setCategory(val))}
          options={[
            { value: "", label: "All Categories" },
            ...categoryOptions.map((c) => ({ value: c, label: c })),
          ]}
        />

        <Dropdown
          value={subcategory}
          onChange={(val) => dispatch(setSubcategory(val))}
          options={[
            { value: "", label: "All Subcategories" },
            ...subcategoryOptions.map((s) => ({ value: s, label: s })),
          ]}
        />

        <Dropdown
          value={priceRange}
          onChange={(val) => dispatch(setPriceRange(val))}
          options={[
            { value: "", label: "All Prices" },
            { value: "0-500", label: "₹0 - ₹500" },
            { value: "500-1000", label: "₹500 - ₹1000" },
            { value: "1000-2000", label: "₹1000 - ₹2000" },
            { value: "2000+", label: "₹2000+" },
          ]}
        />

        <Dropdown
          value={sort}
          onChange={(val) => dispatch(setSort(val))}
          options={[
            { value: "", label: "Sort" },
            { value: "az", label: "A → Z" },
            { value: "za", label: "Z → A" },
            { value: "lowhigh", label: "Low → High" },
            { value: "highlow", label: "High → Low" },
          ]}
        />

        <button
          onClick={() => dispatch(clearFilters())}
          className="px-4 py-2 rounded-full border border-[#ff5757] text-[#ff5757] hover:bg-[#ff5757] hover:text-white transition"
        >
          Clear
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {finalProducts.length > 0 ? (
          finalProducts.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No Products Found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
