import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "./../assets/assets";
import { useAppContext } from "./../context/AppContext";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

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
    axios,
    setCartItems,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      if (data.success) {
        setUser(null);
        setCartItems({});
        navigate("/", { replace: true });
        setOpen(false);
        toast.success("Déconnexion réussie");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      setCartItems({});
      navigate("/", { replace: true });
      setOpen(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-20">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "text-primary" : "")}
        >
          Accueil
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? "text-primary" : "")}
        >
          Tous les Produits
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "text-primary" : "")}
        >
          Contact
        </NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setsearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Rechercher des produits"
          />
          <img
            src={assets.search_icon}
            alt="icône de recherche"
            className="w-4 h-4"
          />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="icône du panier"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => setshowUserLogin(true)}
            className="bg-primary text-white text-sm px-6 py-2 rounded-full"
          >
            Connexion
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="border border-gray-300 rounded-full h-9 w-9 flex items-center justify-center cursor-pointer"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>

            {/* User Menu */}
            {open && (
              <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-52 space-y-2">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <hr />
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="text-gray-800 hover:text-primary w-full text-left"
                >
                  Mon Profil
                </button>
                <button
                  onClick={() => {
                    navigate("/my-orders");
                    setOpen(false);
                  }}
                  className="text-gray-800 hover:text-primary w-full text-left"
                >
                  Mes Commandes
                </button>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 w-full text-left"
                >
                  Déconnexion
                </button>
              </div>
            )}
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
            alt="icône du panier"
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
          <img src={assets.menu_icon} alt="icône du menu" className="" />
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
            className={({ isActive }) =>
              `w-full py-2 hover:text-primary transition-colors duration-200 ${
                isActive ? "text-primary" : ""
              }`
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `w-full py-2 hover:text-primary transition-colors duration-200 ${
                isActive ? "text-primary" : ""
              }`
            }
          >
            Tous les Produits
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `w-full py-2 hover:text-primary transition-colors duration-200 ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                Mon Profil
              </NavLink>
              <NavLink
                to="/my-orders"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `w-full py-2 hover:text-primary transition-colors duration-200 ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                Mes Commandes
              </NavLink>
            </>
          )}

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `w-full py-2 hover:text-primary transition-colors duration-200 ${
                isActive ? "text-primary" : ""
              }`
            }
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
              Connexion
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full cursor-pointer px-6 py-3 bg-primary hover:bg-dull transition-all duration-200 text-white rounded-lg text-sm font-medium"
            >
              Déconnexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
