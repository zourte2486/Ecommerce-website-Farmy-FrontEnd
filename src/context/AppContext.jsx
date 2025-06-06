import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setsearchQuery] = useState("");
  const [addresses, setAddresses] = useState([]);

  // fetch user addresses
  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  // fetch user auth status, user data, cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth", {
        withCredentials: true,
      });
      if (data.success) {
        setUser({ ...data.user, token: data.token });
        // Initialize cart items with a default empty object if none exists
        setCartItems(data.user.cartItems || {});
        // Fetch addresses after user is set
        await fetchAddresses();
      } else {
        setUser(null);
        setCartItems({});
        setAddresses([]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        setCartItems({});
        setAddresses([]);
        return;
      }
      console.error("Auth check error:", error);
      setUser(null);
      setCartItems({});
      setAddresses([]);
    }
  };

  // fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth", {
        withCredentials: true,
      });
      setIsSeller(data.success);
    } catch (error) {
      // Silently handle 401 errors as they're expected when not logged in
      if (error.response?.status === 401) {
        setIsSeller(false);
        return;
      }

      console.error("Seller auth check error:", error);
      setIsSeller(false);
    }
  };

  // fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Products fetch error:", error);
      toast.error("Failed to fetch products");
    }
  };

  // Helper to sync cart with backend Cart collection
  const syncCartWithBackend = async (newCart) => {
    if (!user || !user._id) return;
    try {
      const response = await axios.post("/api/cart/update", {
        userId: user._id,
        cartItems: newCart || {},
      });

      if (!response.data.success) {
        console.error("Failed to sync cart:", response.data.message);
        toast.error("Failed to sync cart with server");
      }
    } catch (err) {
      console.error("Failed to sync cart with backend:", err);
      toast.error("Failed to sync cart with server");
    }
  };

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Item added to cart");
    syncCartWithBackend(cartData);
  };

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity) => {
    if (!itemId || quantity < 1) return;

    let cartData = structuredClone(cartItems || {});
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
    syncCartWithBackend(cartData);
  };

  const removeFromCart = (productId) => {
    if (!productId) return;

    setCartItems((prevItems) => {
      const currentItems = prevItems || {};
      const currentCount = currentItems[productId] || 0;
      let newCart;

      if (currentCount <= 1) {
        const { [productId]: _, ...rest } = currentItems;
        newCart = rest;
      } else {
        newCart = { ...currentItems, [productId]: currentCount - 1 };
      }

      toast.success("Item removed from Cart");
      syncCartWithBackend(newCart);
      return newCart;
    });
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // Check auth status on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.all([fetchUser(), fetchSeller(), fetchProducts()]);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializeApp();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setshowUserLogin,
    products,
    setProducts,
    cartItems,
    setCartItems,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setsearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    addresses,
    setAddresses,
    fetchAddresses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
