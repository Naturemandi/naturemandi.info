import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaUserShield,
  FaBoxOpen,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
  FaHeadset
} from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { useSearch } from '../context/SearchContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;
  const { setSearchTerm } = useSearch();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalCount);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setSearchTerm(value.toLowerCase().trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        
        {/* Left - Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="NatureMandi" className="h-20" />
        </Link>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-grow max-w-2xl mx-6">
          <div className="flex w-full rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-green-500">
            <input
              type="text"
              placeholder="Search Desi Rajma, Pickles, Spices..."
              value={searchText}
              onChange={handleSearch}
              className="flex-grow px-3 py-2 outline-none text-sm"
            />
            <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-center">
              <FiSearch size={18} />
            </div>
          </div>
        </div>

        {/* Right - Cart & Profile */}
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <Link to="/cart" className="relative hover:text-green-600 flex items-center gap-1">
            <FaShoppingCart />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hover:text-green-600 flex items-center gap-1"
              >
                <FaUserCircle size={20} />
                <span className="hidden sm:inline">
                  {user.name?.split(' ')[0] || 'Profile'}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border shadow-lg rounded-md z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUser /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaBoxOpen /> Orders
                  </Link>
                  <Link
                    to="/support"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaHeadset /> Support
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-yellow-600"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUserShield /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-green-700 border border-green-600 hover:bg-green-600 hover:text-white px-3 py-1 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile - Search (visible only on small screens) */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex w-full rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-green-500">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            className="flex-grow px-3 py-2 outline-none text-sm"
          />
          <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-center">
            <FiSearch size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
