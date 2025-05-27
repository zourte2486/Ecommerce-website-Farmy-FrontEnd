import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "./../assets/assets";
import { toast } from "react-hot-toast";

const Cart = () => {
  const {
    products,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    setCartItems,
    user,
    axios,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }

    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      setIsPlacingOrder(true);

      if (paymentOption === "COD") {
        const response = await axios.post("/api/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.offerPrice,
          })),
          address: {
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            country: selectedAddress.country,
            zipCode: selectedAddress.pincode,
          },
        });

        if (response.data.success) {
          toast.success("Order placed successfully!");
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(response.data.message || "Failed to place order");
        }
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Handle checkout navigation for online payments
  const handleCheckout = () => {
    if (cartArray.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address first");
      return;
    }

    // Pass cart data and selected address to checkout page
    navigate("/checkout", {
      state: {
        cartItems: cartArray,
        selectedAddress: selectedAddress,
        totalAmount: ((getCartAmount() * 2) / 100 + getCartAmount()).toFixed(2),
      },
    });
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  return products.length > 0 && cartItems ? (
    cartArray.length === 0 ? (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4">🛒</div>
        <div className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty!
        </div>
        <div className="text-gray-500 mb-8">
          Looks like you haven't added anything yet.
        </div>
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull text-white font-bold rounded-full shadow-md text-lg transition"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow_right_icon_colored"
            className="w-5 h-5"
          />
          Browse All Products
        </button>
      </div>
    ) : (
      <div className="flex flex-col md:flex-row mt-16 gap-10">
        <div className="flex-1 max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
            <span>Shopping Cart</span>
            <span className="text-base font-medium text-primary-dull bg-primary/10 px-3 py-1 rounded-full">
              {getCartCount()} Items
            </span>
          </h1>

          <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-400 text-base font-semibold pb-3 border-b border-gray-200 mb-2">
            <p className="text-left">Product Details</p>
            <p className="text-center">Subtotal</p>
            <p className="text-center">Action</p>
          </div>

          {cartArray.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium py-4 border-b border-gray-100 last:border-b-0 group hover:bg-primary/5 rounded-xl transition"
            >
              <div className="flex items-center md:gap-6 gap-3">
                <div
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${
                        product._id
                      }`
                    );
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-20 h-20 flex items-center justify-center border border-primary/20 rounded-xl bg-primary/10 group-hover:scale-105 transition"
                >
                  <img
                    className="max-w-full h-full object-cover rounded-lg"
                    src={product.image[0]}
                    alt={product.name}
                  />
                </div>
                <div>
                  <p className="hidden md:block font-semibold text-gray-900">
                    {product.name}
                  </p>
                  <div className="font-normal text-gray-500/70">
                    <p>
                      Weight: <span>{product.Weight || "N/A"}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p>Qty:</p>
                      <select
                        onChange={(e) =>
                          updateCartItem(product._id, Number(e.target.value))
                        }
                        value={cartItems[product._id]}
                        className="outline-primary border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-primary/30"
                      >
                        {Array(
                          cartItems[product._id] > 9
                            ? cartItems[product._id]
                            : 9
                        )
                          .fill("")
                          .map((_, index) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                MAD {product.offerPrice * product.quantity}
              </div>
              <button
                onClick={() => removeFromCart(product._id)}
                className="cursor-pointer mx-auto bg-red-50 hover:bg-red-100 p-2 rounded-full transition group"
              >
                <img
                  src={assets.remove_icon}
                  alt="Delete"
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-semibold hover:underline"
          >
            <img
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>

        <div className="max-w-[360px] w-full bg-primary/10 p-7 max-md:mt-16 border border-primary/20 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Order Summary
          </h2>
          <hr className="border-primary/20 my-4" />

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Delivery Address
            </p>
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-gray-700 text-sm">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`
                  : "No address found"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-primary hover:underline cursor-pointer text-xs font-medium"
              >
                Change
              </button>
              {showAddress && (
                <div className="absolute top-12 py-1 bg-white border border-primary/20 text-sm w-full rounded shadow-lg z-10">
                  {addresses.map((address, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      className="text-gray-700 p-2 hover:bg-primary/10 cursor-pointer rounded"
                    >
                      {address.street}, {address.city}, {address.state},{" "}
                      {address.country}
                    </p>
                  ))}
                  <p
                    onClick={() => navigate("/add-address")}
                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10 rounded"
                  >
                    Add address
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs font-semibold uppercase mt-6 text-gray-500">
              Payment Method
            </p>

            <select
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-full border border-primary/20 bg-white px-3 py-2 mt-2 outline-primary rounded focus:ring-2 focus:ring-primary/30"
            >
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          <hr className="border-primary/20" />

          <div className="text-gray-700 mt-4 space-y-2 text-base">
            <p className="flex justify-between">
              <span>Price</span>
              <span className="font-semibold text-primary">
                MAD{getCartAmount()}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600 font-semibold">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span className="font-semibold">
                MAD{(getCartAmount() * 2) / 100}
              </span>
            </p>
            <p className="flex justify-between text-lg font-bold mt-3">
              <span>Total Amount:</span>
              <span className="text-primary">
                MAD{((getCartAmount() * 2) / 100 + getCartAmount()).toFixed(2)}
              </span>
            </p>
          </div>

          {/* Updated button logic */}
          {paymentOption === "COD" ? (
            <button
              onClick={placeOrder}
              disabled={isPlacingOrder}
              className="w-full py-3 mt-6 cursor-pointer bg-primary hover:bg-primary-dull transition text-white font-bold rounded-lg shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                "Place Order"
              )}
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={!selectedAddress}
              className="w-full py-3 mt-6 cursor-pointer bg-green-600 hover:bg-green-700 transition text-white font-bold rounded-lg shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          )}

          {/* Address warning for online payment */}
          {paymentOption === "Online" && !selectedAddress && (
            <p className="text-red-500 text-xs mt-2 text-center">
              Please select a delivery address to proceed
            </p>
          )}
        </div>
      </div>
    )
  ) : null;
};

export default Cart;
