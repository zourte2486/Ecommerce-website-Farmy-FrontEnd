import React, { useState } from "react";
import { NavLink } from "react-router";
import { assets } from "./../assets/assets";
import { useAppContext } from "./../context/AppContext";
import { useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    setshowUserLogin,
    navigate,
    searchQuery,
    setsearchQuery,
    getCartCount,
    getCartAmount,
  } = useAppContext();

  const logout = async () => {
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  });

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-20">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Product</NavLink>
        <NavLink to="/">Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setsearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search_icon" className="w-4 h-4" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="nav_cart_icon"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => setshowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} alt="" className="w-10" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md test-sm z-30">
              <li
                onClick={() => navigate("my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="nav_cart_icon"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className=""
        >
          <img src={assets.menu_icon} alt="menu_icon" className="" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-lg py-6 flex-col items-start gap-4 px-6 text-sm md:hidden z-30 transition-all duration-300 ease-in-out`}
        >
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="w-full py-2 hover:text-primary transition-colors duration-200"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="w-full py-2 hover:text-primary transition-colors duration-200"
          >
            All Products
          </NavLink>

          {user && (
            <NavLink
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="w-full py-2 hover:text-primary transition-colors duration-200"
            >
              My Orders
            </NavLink>
          )}

          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="w-full py-2 hover:text-primary transition-colors duration-200"
          >
            Contact
          </NavLink>

          <div className="w-full border-t border-gray-200 my-2"></div>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setshowUserLogin(true);
              }}
              className="w-full cursor-pointer px-6 py-3 bg-primary hover:bg-dull transition-all duration-200 text-white rounded-lg text-sm font-medium"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full cursor-pointer px-6 py-3 bg-primary hover:bg-dull transition-all duration-200 text-white rounded-lg text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
