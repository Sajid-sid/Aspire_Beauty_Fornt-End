import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { setSearchTerm, resetAll } from "../features/filters/filterSlice";

import navLogo from "../assets/navLogo.png";

import { FaSearch, FaTimes, FaRegUser } from "react-icons/fa";
import {
  IoMenu,
  IoClose,
  IoNotificationsOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { GrCart } from "react-icons/gr";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowDropdown(false);
  };

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
      } else {
        const firstLetter = user?.fullname
          ? user.fullname.charAt(0).toUpperCase()
          : "U";
        return (
          <div
            className="flex items-center justify-center rounded-full bg-gray-200 text-[#001b3d] font-medium"
            style={{ width: size, height: size }}
          >
            {firstLetter}
          </div>
        );
      }
    } else {
      return (
        <FaRegUser
          style={{ width: size, height: size }}
          className="text-[#001b3d]"
        />
      );
    }
  };

  return (
    <nav className="shadow-md bg-white sticky top-0 z-50">

      {/* ---------------- DESKTOP NAV (unchanged) ---------------- */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8 sm:px-10 py-3 justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl">
          <img className="w-30 h-20 object-contain" src={navLogo} alt="logo" />
        </NavLink>

        {/* Center Links */}
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

        {/* Search */}
        <div className="flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full sm:w-96">
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

        {/* Right */}
        <div className="flex items-center gap-5 text-[#001b3d] relative">

          {/* User Dropdown */}
          <div className="relative">
            {token ? (
              <>
                <button onClick={() => setShowDropdown(!showDropdown)}>
                  {renderAvatar()}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg py-2 w-36">
                    <NavLink
                      to="/account"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-[#001b3d] hover:bg-gray-100"
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
          <NavLink to="/cart" className="relative">
            <GrCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#ff5757] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </NavLink>

          <IoNotificationsOutline className="cursor-pointer text-xl" />
        </div>
      </div>

      {/* ---------------- MOBILE NAV TOP BAR ---------------- */}
      <div className="md:hidden flex justify-between items-center px-5 py-4 bg-white shadow">

        {/* Menu Button */}
        <button className="text-3xl text-[#001b3d]" onClick={() => setMenuOpen(true)}>
          <IoMenu />
        </button>

        {/* Logo */}
        <NavLink to="/">
          <img src={navLogo} className="h-12 object-contain" alt="logo" />
        </NavLink>

        {/* Search Icon + Cart */}
        <div className="flex items-center gap-5 text-2xl text-[#001b3d]">
          <IoSearchOutline
            className="cursor-pointer"
            onClick={() => navigate("/products")}
          />
          <NavLink to="/cart" className="relative">
            <GrCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#ff5757] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* ---------------- MOBILE MENU DRAWER ---------------- */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[999] transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center px-5 py-5 border-b">
          <h2 className="text-lg font-semibold text-[#001b3d]">Menu</h2>
          <IoClose
            className="text-3xl text-[#001b3d] cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        {/* Search Bar */}
        <div className="px-5 mt-4">
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full outline-none text-sm text-[#001b3d]"
            />
            {search ? (
              <FaTimes onClick={clearSearch} className="text-gray-400 text-lg cursor-pointer" />
            ) : (
              <IoSearchOutline className="text-xl text-[#001b3d]" />
            )}
          </div>
        </div>

        {/* Menu Links */}
        <div className="px-6 mt-6 flex flex-col gap-5 text-[#001b3d] text-lg font-medium">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
          {token ? (
            <NavLink to="/account" onClick={() => setMenuOpen(false)}>
              Profile
            </NavLink>
          ) : (
            <NavLink to="/user-login" onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
          )}
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>
        </div>
      </div>

      {/* DARK OVERLAY */}
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
