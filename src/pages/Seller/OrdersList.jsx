import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets";

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Commande #{order.orderNumber}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Passée le {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Informations Client
            </h3>
            {order.user && (
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Nom:</span> {order.user.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {order.user.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Téléphone:</span>{" "}
                  {order.user.phone || "Non disponible"}
                </p>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Adresse de Livraison
            </h3>
            {order.shippingAddress ? (
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Rue:</span>{" "}
                  {order.shippingAddress.street}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Ville:</span>{" "}
                  {order.shippingAddress.city}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">État/Province:</span>{" "}
                  {order.shippingAddress.state}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Code Postal:</span>{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Pays:</span>{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Adresse non disponible</p>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Articles Commandés
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white p-3 rounded-lg"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.image?.[0] || assets.placeholder_image}
                      alt={item.product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">
                      {item.product?.name || "Product Unavailable"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Quantité: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Prix unitaire: MAD{item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      MAD{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Résumé de la Commande
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>MAD{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span className="text-green-600">Gratuit</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">MAD{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OrdersList = () => {
  const { axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      colorMap[status.toLowerCase()] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  const getStatusOptionColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-800 bg-green-50 hover:bg-green-100";
      case "processing":
        return "text-blue-800 bg-blue-50 hover:bg-blue-100";
      case "cancelled":
        return "text-red-800 bg-red-50 hover:bg-red-100";
      case "pending":
        return "text-yellow-800 bg-yellow-50 hover:bg-yellow-100";
      case "shipped":
        return "text-purple-800 bg-purple-50 hover:bg-purple-100";
      default:
        return "text-gray-800 bg-gray-50 hover:bg-gray-100";
    }
  };

  // Create a memoized version of fetchOrders
  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/order/seller");
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(
          response.data.message || "Échec du chargement des commandes"
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      toast.error(
        error.response?.data?.message || "Échec du chargement des commandes"
      );
    } finally {
      setLoading(false);
    }
  }, [axios]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/order/status/${orderId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success("Statut de la commande mis à jour avec succès");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDeleteOrder = async (orderId, e) => {
    e.stopPropagation();
    setDeletingOrderId(orderId);
    try {
      const response = await axios.delete(`/api/order/delete/${orderId}`);
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        toast.success("Commande supprimée avec succès");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Erreur lors de la suppression de la commande");
    } finally {
      setDeletingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Actualiser les commandes toutes les 30 secondes
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }

  const translateStatus = (status) => {
    const statusMap = {
      pending: "En attente",
      processing: "En traitement",
      shipped: "Expédié",
      delivered: "Livré",
      cancelled: "Annulé",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-start w-full mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Liste des Commandes
        </h2>
        <div className="w-16 h-0.5 bg-gray-200 rounded-full mt-2"></div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === status
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status === "all" ? "Toutes" : translateStatus(status)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Commande #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {translateStatus(order.status)}
                    </span>
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="text-primary hover:text-primary-dull transition-colors"
                    >
                      {expandedOrders[order._id] ? "Voir moins" : "Voir plus"}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrders[order._id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-4"
                    >
                      {/* Customer Info */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Client
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.user?.name || "Client inconnu"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.user?.email}
                        </p>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  item.product?.image?.[0] ||
                                  assets.placeholder_image
                                }
                                alt={item.product?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-gray-800">
                                {item.product?.name || "Product Unavailable"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Quantité: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-500">
                                Prix: MAD{item.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">
                                MAD{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            Total
                          </span>
                          <span className="text-lg font-semibold text-primary">
                            MAD{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          {[
                            "pending",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ].map((status) => (
                            <option key={status} value={status}>
                              {translateStatus(status)}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => handleDeleteOrder(order._id, e)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersList;
