import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { user, axios } = useAppContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/order/user?userId=${user._id}`);
      if (response.data.success) {
        // Sort orders by date, newest first
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Refresh orders every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center"
      >
        <img
          src={assets.profile_icon}
          alt="Login Required"
          className="w-24 mb-4 opacity-50"
        />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Connexion Requise
        </h2>
        <p className="text-gray-500 mb-4">
          Veuillez vous connecter pour voir vos commandes
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full transition"
        >
          Se Connecter
        </motion.button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-6">Mes Commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'%3E%3C/path%3E%3Cline x1='3' y1='6' x2='21' y2='6'%3E%3C/line%3E%3Cpath d='M16 10a4 4 0 0 1-8 0'%3E%3C/path%3E%3C/svg%3E"
            alt="Aucune commande"
            className="w-32 mx-auto mb-4 opacity-50"
          />
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Aucune commande
          </h2>
          <p className="text-gray-500 mb-4">
            Vous n'avez pas encore passé de commande
          </p>
          <button
            onClick={() => navigate("/products")}
            className="text-primary hover:underline"
          >
            Commencer vos achats
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === "pending"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setActiveTab("processing")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === "processing"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setActiveTab("delivered")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === "delivered"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Livrées
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === "cancelled"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Annulées
            </button>
          </div>

          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-600">
                        Commande #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Passée le{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status === "pending" && "En attente"}
                      {order.status === "processing" && "En cours"}
                      {order.status === "delivered" && "Livrée"}
                      {order.status === "cancelled" && "Annulée"}
                    </div>
                  </div>

                  <div className="mt-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 items-center mb-4 last:mb-0"
                      >
                        {item.product ? (
                          <>
                            <img
                              src={
                                item.product.image?.[0] ||
                                assets.placeholder_image
                              }
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium">
                                {item.product.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantité: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-600">
                                Prix: {item.price} MAD
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs text-center px-2">
                                Produit non disponible
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-400">
                                Produit supprimé
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantité: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-600">
                                Prix: {item.price} MAD
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Total</p>
                      <p className="font-semibold">{order.totalAmount} MAD</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Mode de paiement:{" "}
                      {order.paymentType === "COD"
                        ? "Paiement à la livraison"
                        : "Paiement en ligne"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
