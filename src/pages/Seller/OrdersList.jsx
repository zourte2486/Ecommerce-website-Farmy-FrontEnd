import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const OrdersList = () => {
  const { axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/order/seller");
      if (response.data.success) {
        console.log("Fetched orders:", response.data.orders); // Debug log
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/order/status/${orderId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success("Order status updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Orders Management
      </h1>

      {/* Order Status Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((tab) => (
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
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500">
              There are no orders matching the selected filter
            </p>
          </motion.div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.user && (
                      <p className="text-gray-500 text-sm mt-1">
                        Customer: {order.user.name} ({order.user.email})
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(
                        order.status
                      )} border focus:ring-2 focus:ring-primary/30 cursor-pointer transition-colors duration-200`}
                    >
                      <option
                        value="pending"
                        className={getStatusOptionColor("pending")}
                      >
                        Pending
                      </option>
                      <option
                        value="processing"
                        className={getStatusOptionColor("processing")}
                      >
                        Processing
                      </option>
                      <option
                        value="shipped"
                        className={getStatusOptionColor("shipped")}
                      >
                        Shipped
                      </option>
                      <option
                        value="delivered"
                        className={getStatusOptionColor("delivered")}
                      >
                        Delivered
                      </option>
                      <option
                        value="cancelled"
                        className={getStatusOptionColor("cancelled")}
                      >
                        Cancelled
                      </option>
                    </select>
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
                      <p className="text-sm text-gray-500">Delivery Address</p>
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
      </div>
    </motion.div>
  );
};

export default OrdersList;
