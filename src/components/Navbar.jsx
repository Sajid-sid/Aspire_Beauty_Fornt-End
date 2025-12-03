import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { setSearchTerm, resetAll } from "../features/filters/filterSlice";

import navLogo from "../assets/navLogo.png";

import { FaSearch, FaTimes, FaRegUser } from "react-icons/fa";
import { IoMenu, IoClose, IoNotificationsOutline, IoSearchOutline } from "react-icons/io5";
import { GrCart } from "react-icons/gr";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  // Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    setShowDropdown(false);
  };

  // Search trigger On Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch(resetAll());
      dispatch(setSearchTerm(search));
      navigate("/products");
      setMenuOpen(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    dispatch(resetAll());
    dispatch(setSearchTerm(""));
    navigate("/products");
  };

  // Render Avatar
  const renderAvatar = () => {
    const size = 24;

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
      } else {
        const firstLetter = user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U";
        return (
          <div
            className="flex items-center justify-center rounded-full bg-gray-200 text-[#001b3d] font-medium"
            style={{ width: size, height: size, fontSize: 14 }}
          >
            {firstLetter}
          </div>
        );
      }
    } else {
      return <FaRegUser style={{ width: size, height: size }} className="text-[#001b3d]" />;
    }
  };

  return (
    <nav className="shadow-md bg-white sticky top-0 z-50">

      {/* ---------------- DESKTOP NAV ---------------- */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8 sm:px-10 py-3 justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl">
          <img className="w-30 h-20 object-contain" src={navLogo} alt="logo" />
        </NavLink>

        {/* Center Nav */}
        <div className="flex items-center gap-8 text-[#001b3d] font-medium">
          {["/", "/products", "/about"].map((path, index) => {
            const names = ["Home", "Products", "About"];
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => path === "/products" && dispatch(resetAll())}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#ff5757] border-b-2 border-[#ff5757] pb-1"
                    : "hover:text-[#ff5757]"
                }
              >
                {names[index]}
              </NavLink>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full sm:w-96 focus-within:ring-2 focus-within:ring-[#001b3d]/40 transition">
          <FaSearch className="text-[#001b3d] mr-2" />
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-transparent outline-none text-sm text-[#001b3d]"
          />
          {search && (
            <FaTimes
              onClick={clearSearch}
              className="ml-2 text-gray-400 hover:text-[#ff5757] cursor-pointer"
            />
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 text-[#001b3d] text-xl relative">

          {/* User Dropdown */}
          <div className="relative">
            {token ? (
              <>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="cursor-pointer hover:text-[#ff5757]"
                >
                  {renderAvatar()}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-36 z-50">
                    <NavLink
                      to="/account"
                      className="block px-4 py-2 text-sm text-[#001b3d] hover:bg-gray-100 border-b"
                      onClick={() => setShowDropdown(false)}
                    >
                      Account
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#ff5757] hover:bg-gray-100"
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

          {/* Cart */}
          <NavLink to="/cart" className="relative hover:text-[#ff5757]">
            <GrCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#ff5757] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </NavLink>

          <IoNotificationsOutline className="hover:text-[#ff5757] cursor-pointer" />
        </div>
      </div>

      {/* ---------------- MOBILE NAV ---------------- */}
      <div className="md:hidden flex justify-between items-center px-5 py-5 border-b border-gray-100">

        {/* Menu Button */}
        <button className="text-2xl text-[#001b3d]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoClose /> : <IoMenu />}
        </button>

        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img className="h-12 object-contain" src={navLogo} alt="logo" />
        </NavLink>

        {/* User / Login */}
        {token ? (
          <NavLink to="/account">{renderAvatar()}</NavLink>
        ) : (
          <NavLink to="/user-login">{renderAvatar()}</NavLink>
        )}
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-inner border-t border-gray-200 pb-6">

          {/* MOBILE SEARCH BAR — expandable */}
          <div
            className={`flex items-center border border-gray-300 rounded-full px-4 py-2 mx-5 mt-4 transition-all duration-300 ${
              mobileSearchFocused ? "w-[90%]" : "w-[80%]"
            }`}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setMobileSearchFocused(true)}
              onBlur={() => setMobileSearchFocused(false)}
              className="w-full bg-transparent outline-none text-sm text-[#001b3d]"
            />

            {search ? (
              <FaTimes
                onClick={clearSearch}
                className="text-gray-400 text-lg cursor-pointer"
              />
            ) : (
              <IoSearchOutline className="text-xl text-[#001b3d]" />
            )}
          </div>

          {/* Links */}
          <div className="px-5 mt-5 flex flex-col gap-4 text-[#001b3d] font-medium text-lg">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
            <NavLink to="/cart" onClick={() => setMenuOpen(false)}>Cart</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
