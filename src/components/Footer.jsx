import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from '../assets/navLogo.png';

const primary = "#001b3d";      // Deep Ocean
const secondary = "#ff5757";    // Corel Red

const Footer = () => {

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white text-gray-700 border-t border-gray-200 py-10 px-6 ">

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

        {/* Brand Section */}
        <div className="flex flex-col items-start">
          <img
            src={logo}
            alt="Aspire Beauty logo"
            className="w-32 md:w-40 object-contain"
          />
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            Discover your inner glow with Aspire Beauty — where confidence meets elegance.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="hover:text-[#001b3d]">All Products</Link></li>
              <li><Link to="/categories" className="hover:text-[#001b3d]">Categories</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#001b3d]">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-secondary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
              <li><Link to="/faqs" className="hover:text-secondary">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Policies</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-[#001b3d]">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#001b3d]">Terms of Service</Link></li>
              <li><Link to="/returns" className="hover:text-[#001b3d]">Returns & Refunds</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-start md:items-end">
          <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:bg-[#001b3d] hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:bg-[#001b3d] hover:text-white transition">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:bg-[#001b3d] hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:bg-[#001b3d] hover:text-white transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="font-semibold text-[#001b3d]">Aspire Beauty</span>.
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
