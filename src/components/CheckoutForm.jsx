import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ cartItems, totalAmount }) => {
  const { axios, user, setCartItems } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const payload = {
        cardNumber: formData.cardNumber,
        user: user,
        cartItems: cartItems.map((item) => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
        })),
        amount: totalAmount,
        shippingAddress: user?.defaultAddress || {},
      };

      const { data } = await axios.post("/api/payment/fake-payment", payload);

      if (data.success) {
        // Clear cart in context
        setCartItems({});
        // Navigate to success page with order ID
        navigate("/order-success", {
          state: {
            orderId: data.order._id,
            orderNumber: data.order.orderNumber,
          },
        });
      } else {
        setError(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Holder
          </label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="3"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {loading ? "Processing..." : `Pay MAD ${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
