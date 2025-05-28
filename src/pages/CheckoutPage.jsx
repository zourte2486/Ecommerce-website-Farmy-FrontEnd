import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import CheckoutForm from "../components/CheckoutForm";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const {
    axios,
    user,
    cartItems: contextCartItems,
    products,
  } = useAppContext();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        if (!user) {
          setError("Veuillez vous connecter pour voir votre panier.");
          setLoading(false);
          return;
        }

        // Get cart data from backend first
        const { data } = await axios.get("/api/cart", {
          withCredentials: true,
        });

        if (data.success && data.cart.items.length > 0) {
          setCartItems(data.cart.items);
          setTotalAmount(data.cart.total);
        } else {
          // Fallback to context cart items if backend cart is empty
          if (
            Object.keys(contextCartItems).length > 0 &&
            products?.length > 0
          ) {
            const items = Object.entries(contextCartItems)
              .map(([productId, quantity]) => ({
                product: products.find((p) => p._id === productId),
                quantity,
              }))
              .filter((item) => item.product);

            const total = items.reduce(
              (acc, item) =>
                acc +
                (item.product.offerPrice || item.product.price) * item.quantity,
              0
            );

            if (items.length > 0) {
              setCartItems(items);
              setTotalAmount(total);
            } else {
              setError("Votre panier est vide");
            }
          } else {
            setError("Votre panier est vide");
          }
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        if (Object.keys(contextCartItems).length > 0 && products?.length > 0) {
          const items = Object.entries(contextCartItems)
            .map(([productId, quantity]) => ({
              product: products.find((p) => p._id === productId),
              quantity,
            }))
            .filter((item) => item.product);

          const total = items.reduce(
            (acc, item) =>
              acc +
              (item.product.offerPrice || item.product.price) * item.quantity,
            0
          );

          if (items.length > 0) {
            setCartItems(items);
            setTotalAmount(total);
          } else {
            setError("Votre panier est vide");
          }
        } else {
          setError(
            err.response?.data?.message || "Échec du chargement du panier"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    } else {
      setLoading(false);
      setError("Veuillez vous connecter pour voir votre panier.");
    }
  }, [user, contextCartItems, products, axios]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">Erreur : {error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Paiement</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Votre panier est vide</p>
          <button
            onClick={() => navigate("/products")}
            className="text-primary hover:underline"
          >
            Continuer les achats
          </button>
        </div>
      ) : (
        <CheckoutForm cartItems={cartItems} totalAmount={totalAmount} />
      )}
    </div>
  );
};

export default CheckoutPage;
