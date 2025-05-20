import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Mock orders data - Replace with actual API call
  useEffect(() => {
    // Simulate API call
    const mockOrders = [
      {
        id: "1",
        date: "2024-03-15",
        status: "delivered",
        total: 299.99,
        items: [
          { name: "Organic Apples", quantity: 2, price: 49.99 },
          { name: "Fresh Spinach", quantity: 1, price: 199.99 },
        ],
        address: "123 Green Street, Garden City, 12345",
      },
      {
        id: "2",
        date: "2024-03-10",
        status: "processing",
        total: 149.99,
        items: [{ name: "Organic Bananas", quantity: 3, price: 49.99 }],
        address: "123 Green Street, Garden City, 12345",
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <img
          src={assets.profile_icon}
          alt="Login Required"
          className="w-24 mb-4 opacity-50"
        />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Login Required
        </h2>
        <p className="text-gray-500 mb-4">Please login to view your orders</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {/* Order Status Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {["all", "processing", "delivered", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
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
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-primary">
                        MAD{item.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="text-gray-800">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-primary">
                        MAD{order.total}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
