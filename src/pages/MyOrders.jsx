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
          Login Required
        </h2>
        <p className="text-gray-500 mb-4">Please login to view your orders</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full transition"
        >
          Go to Login
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {/* Order Status Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {["all", "pending", "processing", "delivered", "cancelled"].map(
          (tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          )
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              key="no-orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <img
                src={assets.box_icon}
                alt="No Orders"
                className="w-24 mx-auto mb-4 opacity-50"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500 mb-4">
                You haven't placed any orders yet
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/products")}
                className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full transition"
              >
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 items-center"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-800">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: MAD{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            MAD{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Delivery Address
                        </p>
                        <p className="text-gray-800">
                          {order.shippingAddress
                            ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
                            : "Address not available"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-primary">
                          MAD{order.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MyOrders;
