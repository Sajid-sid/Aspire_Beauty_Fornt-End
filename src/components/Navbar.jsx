import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logoutUser } from "../features/user/userSlice";
import {
  setSearchTerm,
  resetAll,
  setCategory,
} from "../features/filters/filterSlice";

import navLogo from "../assets/navLogo.png";

import { FaSearch, FaTimes, FaRegUser } from "react-icons/fa";
import {
  IoMenu,
  IoClose,
  IoNotificationsOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { GrCart } from "react-icons/gr";

const RECENT_LIMIT = 5;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const mobileSearchRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  /* ================= RECENT SEARCHES ================= */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [
      term,
      ...recentSearches.filter((t) => t !== term),
    ].slice(0, RECENT_LIMIT);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  /* ================= FILTER HANDLERS ================= */

  const handleFaceCare = () => {
    dispatch(resetAll());
    dispatch(setCategory("Face Care"));
    navigate("/products");
  };

  const handleFaceMakeup = () => {
    dispatch(resetAll());
    dispatch(setCategory("Face Makeup"));
    navigate("/products");
  };

  /* ================= SEARCH ================= */

  const handleSearch = (value) => {
    if (!value.trim()) return;
    dispatch(resetAll());
    dispatch(setSearchTerm(value));
    saveRecentSearch(value);
    navigate("/products");
    setMenuOpen(false);
  };

  const clearSearch = () => {
    setSearch("");
    dispatch(resetAll());
    dispatch(setSearchTerm(""));
    navigate("/products");
  };

  //alert message at top

  const messages = [
    "🔥 Get your amazing deals now!",
    "🎉 Flat 50% OFF on selected products",
    "🚚 Free delivery on all orders",
  ];

  


  /* ================= AUTH ================= */

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowDropdown(false);
    setMenuOpen(false);
  };

  /* ================= AVATAR ================= */

  const renderAvatar = () => {
    const size = 26;

    if (token) {
      if (user?.profile) {
        return (
          <img
            src={user.profile}
            alt="Profile"
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
          />
        );
      }

      return (
        <div
          className="flex items-center justify-center rounded-full bg-gray-200 text-[#001b3d] font-medium"
          style={{ width: size, height: size }}
        >
          {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
        </div>
      );
    }

    return <FaRegUser className="text-[#001b3d]" size={size} />;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="relative bg-[#0f4c5c] overflow-hidden h-9 flex items-center">
        <div className="marquee-track">
          {[...messages, ...messages].map((msg, i) => (
            <span
              key={i}
              className="mx-10 text-white text-sm font-semibold whitespace-nowrap"
            >
              {msg}
            </span>
          ))}
        </div>
      </div>






      {/* ================= DESKTOP NAV ================= */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 py-3 items-center gap-6">
        <NavLink to="/" className="flex-shrink-0">
          <img src={navLogo} alt="logo" className="h-16" />
        </NavLink>

        <div className="flex gap-6 text-[#001b3d] font-medium">
          <NavLink to="/" className="cursor-pointer hover:text-[#ff5757] transition-colors" >Home</NavLink>
          <button onClick={handleFaceCare} className="cursor-pointer hover:text-[#ff5757] transition-colors" >Face Care</button>
          <button onClick={handleFaceMakeup} className="cursor-pointer hover:text-[#ff5757] transition-colors" >Face Makeup</button>
          <NavLink to="/products" className="cursor-pointer hover:text-[#ff5757] transition-colors" onClick={() => dispatch(resetAll())}>
            Products
          </NavLink>
          <NavLink to="/about" className="cursor-pointer hover:text-[#ff5757] transition-colors" >About</NavLink>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="relative flex-1 max-w-lg">
          <div className="flex items-center bg-white rounded-full shadow px-4 py-2 border border-transparent focus-within:border-[#ff5757] transition">

            <FaSearch className="mr-2 text-[#001b3d]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
              placeholder="Search products..."
              className="w-full outline-none text-sm"
            />
            {search && (
              <FaTimes
                onClick={clearSearch}
                className="cursor-pointer text-gray-400 hover:text-[#ff5757] transition"
              />

            )}
          </div>

          {search && recentSearches.length > 0 && (
            <div className="absolute w-full mt-2 bg-white border rounded-xl shadow">
              <p className="px-4 py-2 text-xs text-gray-400">
                Recent searches
              </p>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(term)}
                  className="block w-full px-4 py-2 text-left cursor-pointer hover:bg-[#001b3d]/10 hover:text-[#001b3d] transition"

                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            {token ? (
              <>
                <button onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer hover:opacity-80 transition"
                >
                  {renderAvatar()}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow w-36">
                    <NavLink to="/account" className="block px-4 py-2 cursor-pointer hover:bg-[#001b3d]/10 transition">
                      Account
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-[#ff5757] cursor-pointer hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NavLink to="/user-login">{renderAvatar()}</NavLink>
            )}
          </div>

          <NavLink to="/cart" className="relative cursor-pointer hover:text-[#ff5757] transition" >
            <GrCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </NavLink>

          <IoNotificationsOutline size={22} className="cursor-pointer hover:text-[#ff5757] transition" />
        </div>
      </div>

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="lg:hidden flex justify-between items-center px-5 py-4">
        <IoMenu size={30} onClick={() => setMenuOpen(true)} className="cursor-pointer hover:text-[#ff5757] transition" />

        <img src={navLogo} className="h-12" alt="logo" />

        <div className="flex gap-5 text-2xl">
          <IoSearchOutline
            onClick={() => {
              setMenuOpen(true);
              setTimeout(() => mobileSearchRef.current?.focus(), 300);

            }}
            className="cursor-pointer hover:text-[#ff5757] transition"
          />
          <NavLink to="/cart" className="cursor-pointer hover:text-[#ff5757] transition relative">
            <GrCart />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[999] transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center px-5 py-5 border-b">
          <h2 className="font-semibold">Menu</h2>
          <IoClose size={28} onClick={() => setMenuOpen(false)} />
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-5 mt-4">
          <div className="flex items-center border rounded-full px-4 py-2">
            <FaSearch className="mr-2" />
            <input
              ref={mobileSearchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
              placeholder="Search products..."
              className="w-full outline-none text-sm"
            />
            {search && (
              <FaTimes onClick={clearSearch} className="cursor-pointer" />
            )}
          </div>
        </div>

        {/* MOBILE LINKS */}
        <div className="px-6 mt-6 flex flex-col gap-4 text-lg">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#ff5757] transition" >Home</NavLink>

          <button onClick={() => { handleFaceCare(); setMenuOpen(false); }} className="cursor-pointer hover:text-[#ff5757] transition" >
            Face Care
          </button>

          <button onClick={() => { handleFaceMakeup(); setMenuOpen(false); }} className="cursor-pointer hover:text-[#ff5757] transition" >
            Face Makeup
          </button>

          <NavLink to="/products" onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#ff5757] transition" >
            Products
          </NavLink>

          <NavLink to="/about" onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-[#ff5757] transition" >
            About
          </NavLink>

          {/* 🔐 MOBILE AUTH */}
          {!token ? (
            <NavLink
              to="/user-login"
              onClick={() => setMenuOpen(false)}
              className="mt-4 text-[#ff5757] font-semibold"
            >
              Login
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="mt-4"
              >
                Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-left text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[998]"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
