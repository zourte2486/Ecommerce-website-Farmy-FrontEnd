import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    setProducts(dummyProducts);
  }

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setshowUserLogin, products, setProducts };

  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
  };